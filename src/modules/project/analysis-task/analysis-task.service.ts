import { Inject, Injectable } from '@nestjs/common';
import {
  CreateAnalysisTaskDto,
  QueryAnalysisTaskDto,
  UpdateAnalysisTaskDto,
} from './analysis-task.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { MinioService } from 'src/common/minio/minio.service';
import PDFParser from 'pdf2json';
import fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DictData } from '@prisma/client';
@Injectable()
export class AnalysisTaskService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly minioClient: MinioService,
    private readonly httpService: HttpService,
  ) {}
  create(user: ActiveUserData, createAnalysisTaskDto: CreateAnalysisTaskDto) {
    const { pdf, ...rest } = createAnalysisTaskDto;

    return this.prismaService.client.analysisTask.create({
      data: {
        ...rest,
        createBy: user.account,
        pdf: {
          createMany: {
            data: pdf.map((item) => ({
              name: item.name,
              url: item.url,
              createBy: user.account,
            })),
          },
        },
      },
    });
  }

  async findAll(queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    const { name, factoryId, page, pageSize } = queryAnalysisTaskDto;
    const [rows, meta] = await this.prismaService.client.analysisTask
      .paginate({
        where: { name: { contains: name }, factoryId },
        include: { factory: true, dict: true },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.analysisTask.findUnique({
      where: { id },
      include: { pdf: true },
    });
  }

  async execute(user: ActiveUserData, id: number) {
    // const analysisTask =
    //   await this.prismaService.client.analysisTask.findUnique({
    //     where: { id },
    //   });
    // const { data } = await firstValueFrom(
    //   this.httpService.post('http://39.105.100.190:5050/api/frasepdf', {
    //     projectid: analysisTask.id,
    //     filepath: ['pdf/DVW-R1_20240307_1534_REPORT中文.pdf'],
    //     templateid: [0],
    //     ruleid: 1,
    //     factoryid: analysisTask.factoryId,
    //   }),
    // );
    // if (data.detail.result === 1) {
    return this.prismaService.client.analysisTask.update({
      where: { id },
      data: { status: 1 },
    });
    // }
    // return data.detail;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    // 查找 analysisTask 表中 status 为 1 的数据
    // 修改 status 为 2
    const analysisTasks = await this.prismaService.client.analysisTask.findMany(
      { where: { status: 1 } },
    );
    analysisTasks.forEach(async (item) => {
      await this.prismaService.client.analysisTask.update({
        where: { id: item.id },
        data: { status: 2 },
      });
    });
  }

  async getExecutedStatus(id: number) {
    const { data } = await firstValueFrom(
      this.httpService.post('http://39.105.100.190:5050/api/score', {
        projectid: id,
      }),
    );
    console.log(data);
    return data.detail;
  }

  async execute2() {
    const data = await this.prismaService.client.dictData.findMany({
      where: { dictTypeId: 12 },
    });
    const pdfParser = new PDFParser(this, true);
    pdfParser.on('pdfParser_dataError', (errData: any) =>
      console.error(errData.parserError),
    );

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const pdfStringData: string[] = pdfData.Pages.reduce(
        (acc: string[], page) => {
          const texts = page.Texts.map((text) =>
            decodeURIComponent(text.R[0].T),
          );
          return [...acc, ...texts];
        },
        [],
      );

      // 正则匹配 字符串以 '仪表组态' 开头, 并且以 '基本' 结尾的字符串
      const indexes = pdfStringData.reduce((result, item, index) => {
        if (/仪表组态.*基本/g.test(item)) {
          result.push(index);
        }
        return result;
      }, []);
      // 根据获取的索引把数组分割
      const result = indexes.map((item, index) => {
        if (index === indexes.length - 1) {
          return pdfStringData.slice(item, pdfStringData.length);
        } else {
          return pdfStringData.slice(item, indexes[index + 1]);
        }
      });
      result.forEach((item) => {
        this.savePdfData(item, data);
      });
    });
    pdfParser.loadPDF('./public/test.pdf');
  }

  savePdfData(pdfStringData: string[], data: DictData[]) {
    const result: { name: string; value: string; unit: string }[] = [];
    pdfStringData.forEach((text, index) => {
      if (data.some((item) => item.name === text)) {
        const value = pdfStringData[index - 1];
        // 如果value是数字，且后面有单位，则取单位
        const unit = Number(value.split(' ')[0]) ? value.split(' ')[1] : null;
        // push 之前判断是否已经存在, name 和 value 都相同, 则不再 push
        if (
          !result.some((item) => item.name === text && item.value === value)
        ) {
          const params = {
            name: text,
            value: Number(value.split(' ')[0]) ? value.split(' ')[0] : value,
            unit: unit,
          };
          // text 会有重复, 做一些特殊处理
          if (text === '行程' && unit !== '%') return;
          if (text === '循环计数' && unit !== 'counts') return;
          if (text === '行程累计器' && unit !== '%') return;
          if (text === '行程偏差' && unit !== '%') return;
          if (text === '行程偏差' && pdfStringData[index - 2] != '行程') return;
          if (text === '驱动信号' && unit !== '%') return;
          if (text === '驱动信号' && pdfStringData[index - 2] != '供气压力')
            return;
          if (text === '标定日期') {
            params.unit = null;
            params.value = value;
          }
          // 如果 value 是数字，则取数字，否则取原始值
          result.push(params);
        }
      }
    });

    fs.writeFile('./public/test.json', JSON.stringify(result), () => {
      console.log('Done. result');
    });
  }

  async uploadPdf(user: ActiveUserData, file: Express.Multer.File, body: any) {
    // 加上时间戳，避免文件名重复
    console.log(body);
    const fileName = `${Date.now()}-${body.fileName}`;
    await this.minioClient.uploadFile('pdf', fileName, file.buffer);
    const url = await this.minioClient.getUrl('pdf', fileName);
    return { url, name: fileName };
  }

  update(
    id: number,
    user: ActiveUserData,
    updateAnalysisTaskDto: UpdateAnalysisTaskDto,
  ) {
    const { pdf, ...rest } = updateAnalysisTaskDto;
    // 覆盖pdf
    return this.prismaService.client.analysisTask.update({
      where: { id },
      data: {
        ...rest,
        updateBy: user.account,
        pdf: {
          deleteMany: {},
          createMany: {
            data: pdf.map((item) => ({
              name: item.name,
              url: item.url,
              createBy: user.account,
            })),
          },
        },
      },
    });
  }

  remove(id: number) {
    // 级联删除
    return this.prismaService.client.analysisTask.delete({
      where: { id },
    });
  }
}
