import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import {
  CreateFactoryDto,
  importDto,
  QueryFactoryDto,
  UpdateFactoryDto,
} from './factory.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { read, utils } from 'xlsx';
import dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  patchDocument,
  PatchType,
} from 'docx';
import { readFileSync } from 'fs';
import path from 'path';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}
  create(user: ActiveUserData, createFactoryDto: CreateFactoryDto) {
    return this.prismaService.client.factory.create({
      data: { ...createFactoryDto, createBy: user.account },
    });
  }

  async findAll(user: ActiveUserData, queryFactoryDto: QueryFactoryDto) {
    const { name, beginTime, endTime, filterId } = queryFactoryDto;
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    if (userData.isAdmin) {
      return this.prismaService.client.factory.findMany({
        where: {
          name: { contains: name },
          parentId: !name ? null : undefined,
          NOT: { id: filterId },
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: {
          children: {
            where: { NOT: { id: filterId } },
            include: {
              children: {
                where: { NOT: { id: filterId } },
                include: { children: { where: { NOT: { id: filterId } } } },
              },
            },
          },
        },
      });
    } else {
      const roleIds = userData.role.map((item) => item.id);
      return this.prismaService.client.factory.findMany({
        where: {
          NOT: { id: filterId },
          OR: [
            { createBy: user.account },
            { role: { some: { id: { in: roleIds } } } },
          ],
          name: { contains: name },
          parentId: !name ? null : undefined,
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: {
          children: {
            where: { NOT: { id: filterId } },
            include: {
              children: {
                where: { NOT: { id: filterId } },
                include: {
                  children: { where: { NOT: { id: filterId } } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async import(
    user: ActiveUserData,
    file: Express.Multer.File,
    body: importDto,
  ) {
    const workbook = read(file.buffer, { type: 'buffer' });
    const xslx = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const deviceNames: string[] = [];
    xslx.forEach((item: any) => {
      // 获取所有的 装置 名称
      if (item['装置'] && !deviceNames.includes(item['装置'])) {
        deviceNames.push(item['装置']);
      }
    });
    deviceNames.forEach(async (deviceName) => {
      let device = await this.prismaService.client.device.findFirst({
        where: { name: deviceName, factoryId: body.factoryId },
      });
      if (!device) {
        device = await this.prismaService.client.device.create({
          data: {
            name: deviceName,
            factoryId: body.factoryId,
            createBy: user.account,
          },
        });
      }
      xslx
        .filter((item: any) => item['装置'] === deviceName)
        .forEach(async (item: any) => {
          const valve = await this.prismaService.client.valve.findFirst({
            where: { tag: item['Tag'], deviceId: device.id },
          });
          const data = {
            no: item['编码'],
            fluidName: item['介质'],
            criticalApplication: item['关键应用'],
            tag: item['位号'],
            since:
              item['投用时间'] && dayjs(item['投用时间'].slice(0, -1)).toDate(),
            unit: item['装置'],
            serialNumber: String(item['阀体序列号']),
            valveBrand: item['阀体品牌'],
            valveType: item['阀体类型'],
            valveSize: String(item['阀体口径']),
            valveSeries: item['阀体系列'],
            valveEndConnection: item['阀体连接形式'],
            ValveStemSize: item['阀体阀杆尺寸'],
            valveBodyMaterial: item['阀体阀体材质'],
            valveBonnet: item['阀盖形式'],
            valveTrim: item['阀内件'],
            valveSeatLeakage: item['阀体泄漏等级'],
            valveDescription: item['阀体描述'],
            actuatorBrand: item['执行机构品牌'],
            actuatorType: item['执行机构类型'],
            actuatorSize: item['执行机构尺寸'],
            handwheel: item['手轮'],
            stroke: item['行程'],
            actuatorDescription: item['执行机构描述'],
            regulatorBrand: item['过滤减压阀品牌'],
            regulatorModel: item['过滤减压阀型号'],
            positionerBrand: item['定位器品牌'],
            positionerModel: item['定位器型号'],
            positionerDescription: item['定位器描述'],
            sovBrand: item['电磁阀品牌'],
            sovModel: item['电磁阀型号'],
            sovQty: item['电磁阀数量'],
            lsBrand: item['限位开关品牌'],
            lsModel: item['限位开关型号'],
            lsQty: item['限位开关数量'],
            tripValveBrand: item['保位阀型号'],
            tripValveModel: item['保位阀数量'],
            tripValveQty: item['保位阀数量'],
            vbBrand: item['放大器品牌'],
            vbModel: item['放大器型号'],
            vbQty: item['放大器数量'],
            qeBrand: item['快排阀品牌'],
            qeModel: item['快排阀型号'],
            qeQty: item['快排阀数量'],
            pilotBrand: item['气控阀品牌'],
            pilotModel: item['气控阀型号'],
            pilotQty: item['气控阀数量'],
            signalComparatorBrand: item['信号比较器品牌'],
            signalComparatorModel: item['信号比较器型号'],
            accessory: item['附件种类'],
            accessoryBrand: item['附件品牌'],
            accessoryType: item['附件类型'],
            accessoryQuantity: item['附件数量'],
            accessoryDescription: item['附件描述'],
            instrumentBrand: item['仪表品牌'],
            instrumentType: item['仪表类型'],
            instrumentDescription: item['仪表描述'],
            remark: item['备注'],
            deviceId: device.id,
            factoryId: body.factoryId,
            updateBy: user.account,
          };
          if (valve) {
            await this.prismaService.client.valve.update({
              where: { id: valve.id },
              data,
            });
            // 记录有多少个阀门被更新
          } else {
            await this.prismaService.client.valve.create({ data });
          }
        });
    });
    return { success: true };
  }

  async findChartOne(id: number) {
    const valveBrandGroup = (
      await this.prismaService.client.valve.groupBy({
        by: ['valveBrand'],
        _count: true,
        where: { NOT: { valveBrand: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.valveBrand, value: item._count }));

    const positionerModelGroup = (
      await this.prismaService.client.valve.groupBy({
        by: ['positionerModel'],
        _count: true,
        where: { NOT: { positionerModel: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.positionerModel, value: item._count }));

    return {
      valveBrandGroup,
      positionerModelGroup,
    };
  }

  async findReport(id: number) {
    console.log('findReport', id);
    const experiences = [
      {
        isCurrent: true,
        summary:
          'Full-stack developer working with Angular and Java. Working for the iShares platform',
        title: 'Associate Software Developer',
        startDate: {
          month: 11,
          year: 2017,
        },
        company: {
          name: 'BlackRock',
        },
      },
      {
        isCurrent: false,
        summary:
          'Full-stack developer working with Angular, Node and TypeScript. Working for the iShares platform. Emphasis on Dev-ops and developing the continous integration pipeline.',
        title: 'Software Developer',
        endDate: {
          month: 11,
          year: 2017,
        },
        startDate: {
          month: 10,
          year: 2016,
        },
        company: {
          name: 'Torch Markets',
        },
      },
      {
        isCurrent: false,
        summary:
          'Used ASP.NET MVC 5 to produce a diversity data collection tool for the future of British television.\n\nUsed AngularJS and C# best practices. Technologies used include JavaScript, ASP.NET MVC 5, SQL, Oracle, SASS, Bootstrap, Grunt.',
        title: 'Software Developer',
        endDate: {
          month: 10,
          year: 2016,
        },
        startDate: {
          month: 3,
          year: 2015,
        },
        company: {
          name: 'Soundmouse',
        },
      },
      {
        isCurrent: false,
        summary:
          'Develop web commerce platforms for constious high profile clients.\n\nCreated a log analysis web application with the Play Framework in Java, incorporating Test Driven Development. It asynchronously uploads and processes large (2 GB) log files, and outputs meaningful results in context with the problem. \n\nAnalysis  and  development  of  the payment system infrastructure and user accounts section to be used by several clients of the company such as Waitrose, Tally Weijl, DJ Sports, Debenhams, Ann Summers, John Lewis and others.\n\nTechnologies used include WebSphere Commerce, Java, JavaScript and JSP.',
        title: 'Java Developer',
        endDate: {
          month: 10,
          year: 2014,
        },
        startDate: {
          month: 3,
          year: 2013,
        },
        company: {
          name: 'Soundmouse',
        },
      },
    ];

    const education = [
      {
        degree: 'Master of Science (MSc)',
        fieldOfStudy: 'Computer Science',
        notes:
          'Exam Results: 1st Class with Distinction, Dissertation: 1st Class with Distinction\n\nRelevant Courses: Java and C# Programming, Software Engineering, Artificial Intelligence, \nComputational Photography, Algorithmics, Architecture and Hardware.\n\nCreated a Windows 8 game in JavaScript for the dissertation. \n\nCreated an award-winning 3D stereoscopic game in C# using XNA.',
        schoolName: 'University College London',
        startDate: {
          year: 2012,
        },
        endDate: {
          year: 2013,
        },
      },
      {
        degree: 'Bachelor of Engineering (BEng)',
        fieldOfStudy: 'Material Science and Engineering',
        notes:
          'Exam Results: 2:1, Dissertation: 1st Class with Distinction\n\nRelevant courses: C Programming, Mathematics and Business for Engineers.',
        schoolName: 'Imperial College London',
        startDate: {
          year: 2009,
        },
        endDate: {
          year: 2012,
        },
      },
    ];

    const skills = [
      {
        name: 'Angular',
      },
      {
        name: 'TypeScript',
      },
      {
        name: 'JavaScript',
      },
      {
        name: 'NodeJS',
      },
    ];

    const achievements = [
      {
        issuer: 'Oracle',
        name: 'Oracle Certified Expert',
      },
    ];
    const PHONE_NUMBER = '07534563401';
    const PROFILE_URL = '中文测试';
    const EMAIL = 'docx@com';
    class DocumentCreator {
      create([experiences, educations, skills, achivements]: any) {
        const document = new Document({
          sections: [
            {
              children: [
                new Paragraph({
                  text: 'Dolan Miu',
                  heading: HeadingLevel.TITLE,
                }),
                this.createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
                this.createHeading('Education'),
                ...educations
                  .map((education: any) => {
                    const arr = [];
                    arr.push(
                      this.createInstitutionHeader(
                        education.schoolName,
                        `${education.startDate.year} - ${education.endDate.year}`,
                      ),
                    );
                    arr.push(
                      this.createRoleText(
                        `${education.fieldOfStudy} - ${education.degree}`,
                      ),
                    );

                    const bulletPoints = this.splitParagraphIntoBullets(
                      education.notes,
                    );
                    bulletPoints.forEach((bulletPoint) => {
                      arr.push(this.createBullet(bulletPoint));
                    });

                    return arr;
                  })
                  .reduce((prev: any, curr: any) => prev.concat(curr), []),
                this.createHeading('Experience'),
                ...experiences
                  .map((position: any) => {
                    const arr = [];

                    arr.push(
                      this.createInstitutionHeader(
                        position.company.name,
                        this.createPositionDateText(
                          position.startDate,
                          position.endDate,
                          position.isCurrent,
                        ),
                      ),
                    );
                    arr.push(this.createRoleText(position.title));

                    const bulletPoints = this.splitParagraphIntoBullets(
                      position.summary,
                    );

                    bulletPoints.forEach((bulletPoint) => {
                      arr.push(this.createBullet(bulletPoint));
                    });

                    return arr;
                  })
                  .reduce((prev: any, curr: any) => prev.concat(curr), []),
                this.createHeading('Skills, Achievements and Interests'),
                this.createSubHeading('Skills'),
                this.createSkillList(skills),
                this.createSubHeading('Achievements'),
                ...this.createAchivementsList(achivements),
                this.createSubHeading('Interests'),
                this.createInterests(
                  'Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing.',
                ),
                this.createHeading('References'),
                new Paragraph(
                  'Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk',
                ),
                new Paragraph('More references upon request'),
                new Paragraph({
                  text: 'This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.',
                  alignment: AlignmentType.CENTER,
                }),
              ],
            },
          ],
        });

        return document;
      }

      createContactInfo(phoneNumber: any, profileUrl: any, email: any) {
        return new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun(
              `Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`,
            ),
            new TextRun({
              text: 'Address: 58 Elm Avenue, Kent ME4 6ER, UK',
              break: 1,
            }),
          ],
        });
      }

      createHeading(text: any) {
        return new Paragraph({
          text: text,
          heading: HeadingLevel.HEADING_1,
          thematicBreak: true,
        });
      }

      createSubHeading(text: any) {
        return new Paragraph({
          text: text,
          heading: HeadingLevel.HEADING_2,
        });
      }

      createInstitutionHeader(institutionName: any, dateText: any) {
        return new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          children: [
            new TextRun({
              text: institutionName,
              bold: true,
            }),
            new TextRun({
              text: `\t${dateText}`,
              bold: true,
            }),
          ],
        });
      }

      createRoleText(roleText: string) {
        return new Paragraph({
          children: [
            new TextRun({
              text: roleText,
              italics: true,
            }),
          ],
        });
      }

      createBullet(text: string) {
        return new Paragraph({
          text: text,
          bullet: {
            level: 0,
          },
        });
      }

      createSkillList(skills: any[]) {
        return new Paragraph({
          children: [
            new TextRun(skills.map((skill) => skill.name).join(', ') + '.'),
          ],
        });
      }

      createAchivementsList(achivements: any[]) {
        return achivements.map(
          (achievement) =>
            new Paragraph({
              text: achievement.name,
              bullet: {
                level: 0,
              },
            }),
        );
      }

      createInterests(interests: string) {
        return new Paragraph({
          children: [new TextRun(interests)],
        });
      }

      splitParagraphIntoBullets(text: string) {
        return text.split('\n\n');
      }

      createPositionDateText(startDate: any, endDate: any, isCurrent: any) {
        const startDateText =
          this.getMonthFromInt(startDate.month) + '. ' + startDate.year;
        const endDateText = isCurrent
          ? 'Present'
          : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

        return `${startDateText} - ${endDateText}`;
      }

      getMonthFromInt(value: number) {
        switch (value) {
          case 1:
            return 'Jan';
          case 2:
            return 'Feb';
          case 3:
            return 'Mar';
          case 4:
            return 'Apr';
          case 5:
            return 'May';
          case 6:
            return 'Jun';
          case 7:
            return 'Jul';
          case 8:
            return 'Aug';
          case 9:
            return 'Sept';
          case 10:
            return 'Oct';
          case 11:
            return 'Nov';
          case 12:
            return 'Dec';
          default:
            return 'N/A';
        }
      }
    }
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements,
    ]);

    const docx = await Packer.toBuffer(doc);
    // const docx = writeFileSync('output.docx', b64string);
    // const b64string = await Packer.toBuffer(doc);
    // return Buffer.from(b64string, 'base64');
    // const file = createReadStream(join(process.cwd(), 'package.json'));
    // writeFile('output.docx', b64string);

    return new StreamableFile(docx, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      disposition: 'attachment; filename=My Document.docx',
    });
  }

  async findReport2(id: number) {
    console.log('findReport', id);
    // 从 public 文件夹获取 docx 模板文件
    const data = readFileSync(
      path.resolve(__dirname, '../../../../../public/test.docx'),
    );
    // http://39.105.100.190:9090/api/v1/buckets/template/objects/download?prefix=ZmllbGQtdHJpcC5kb2N4&version_id=null
    // console.log(path.resolve(__dirname, '../../../../../public/test.docx'));
    // const data =
    //   'blob:http://39.105.100.190:9090/c0647ae1-0e19-4d76-8e35-65e261bf61a3';
    console.log(data, '11');
    const file = await patchDocument({
      outputType: 'nodebuffer',
      data,
      patches: {
        todays_date: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: new Date().toLocaleDateString() })],
        },
        school_name: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        address: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'blah blah' })],
        },

        city: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        state: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        zip: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        phone: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        first_name: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        last_name: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        email_address: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        ft_dates: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },

        grade: {
          type: PatchType.PARAGRAPH,
          children: [new TextRun({ text: 'test' })],
        },
      },
    });
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      disposition: 'attachment; filename=My Document.docx',
    });
  }

  findOne(id: number) {
    return this.prismaService.client.factory.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateFactoryDto: UpdateFactoryDto) {
    return this.prismaService.client.factory.update({
      where: { id },
      data: { ...updateFactoryDto, updateBy: user.account },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const factory = await this.prismaService.client.factory.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 名称为${factory.name}的工厂`,
      businessType: 2,
      module: '工厂管理',
      account: user.account,
      ip,
    });
    return '删除成功';
  }
}
