import {
  Inject,
  Injectable,
  InternalServerErrorException,
  StreamableFile,
} from '@nestjs/common';
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
import { readFileSync } from 'fs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { patchDocument, PatchType, TextRun } from 'docx';
// import { mockReport } from './mock';
import {
  table_alarm,
  chart_valves_health_overview,
  chart_values_alarm_overivew,
  chart_valves_quarter,
  table_valves_health_month,
  detail_valves_alarm,
} from './report.helper';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,

    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,

    @Inject(HttpService)
    private readonly httpService: HttpService,

    private readonly minioClient: MinioService,
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
    const factory = await this.prismaService.client.factory.findUnique({
      where: { id },
    });
    try {
      const result = (
        await firstValueFrom(
          this.httpService.post(
            'http://localhost:5050/api/report/factory_report',
            { factoryId: id },
          ),
        )
      ).data.detail;
      console.log(result);
      // const result = mockReport;
      // console.log(scoreDistribution);
      // 从 public 文件夹获取 docx 模板文件
      const data = readFileSync('public/vcm_report_template_cn.docx', 'binary');

      const docBuffer = await patchDocument({
        outputType: 'nodebuffer',
        data,
        patches: {
          report_time: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun({ text: dayjs().format('YYYY年MM月DD日') })],
          },
          report_for: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun({ text: factory.name })],
          },
          chart_valves_health_overview: chart_valves_health_overview(
            result.scoreDistribution,
          ),
          chart_values_alarm_overivew: chart_values_alarm_overivew(
            result.valveOverallStatus,
          ),
          table_alarm_new: table_alarm(result.newProblem),
          table_alarm_known: table_alarm(result.oldProblem),
          chart_valves_quarter: chart_valves_quarter(result.valveQuarterStatus),
          table_valves_health_month: table_valves_health_month(
            result.valveQuarterStatusTrend,
          ),
          detail_valves_alarm: detail_valves_alarm(result.valveDetails),
        },
      });

      const streamOption = {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=utf-8',
        disposition: `attachment; filename*=UTF-8''${encodeURIComponent(
          `${dayjs().format('YYYY-MM-DD')} ${factory.name}阀门报告.docx`,
        )}`,
      };
      return new StreamableFile(docBuffer, streamOption);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('获取数据失败, 请联系技术人员');
    }
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
