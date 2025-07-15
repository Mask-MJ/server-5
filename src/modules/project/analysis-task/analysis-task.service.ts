import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
import { HttpService } from '@nestjs/axios';
import { DictData, AnalysisTask, Prisma } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { firstValueFrom } from 'rxjs';
import { uploadDto } from 'src/common/dto/base.dto';
// import fs from 'fs';
import { EventEmitter2 } from '@nestjs/event-emitter';

dayjs.extend(customParseFormat);
@Injectable()
export class AnalysisTaskService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly minioClient: MinioService,
    @Inject(HttpService) private httpService: HttpService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}
  async create(
    user: ActiveUserData,
    createAnalysisTaskDto: CreateAnalysisTaskDto,
    ip: string,
  ) {
    const { pdf, ...rest } = createAnalysisTaskDto;

    const analysisTask = await this.prismaService.client.analysisTask.create({
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
    this.eventEmitter.emit('create', {
      title: `创建名称为${analysisTask.name}的分析任务`,
      businessType: 1,
      module: '分析任务',
      account: user.account,
      ip,
    });
    return analysisTask;
  }

  async findAll(queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    const { name, factoryId, valveId, page, pageSize } = queryAnalysisTaskDto;
    const [rows, meta] = await this.prismaService.client.analysisTask
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          factoryId,
          valve: valveId ? { some: { id: valveId } } : undefined,
        },
        include: { factory: true, dict: true },
        orderBy: { createdAt: 'desc' },
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
    const analysisTask =
      await this.prismaService.client.analysisTask.findUnique({
        where: { id },
        include: { pdf: true },
      });
    const filepath = analysisTask.pdf.map((item) => item.name);
    const params = {
      projectid: id,
      filepath,
      templateid: [analysisTask.dictTypeId],
      ruleid: analysisTask.ruleId,
      factoryid: analysisTask.factoryId,
    };

    // await this.prismaService.client.valve.update({
    //   where: { id: 60 },
    //   data: {
    //     analysisTask: {
    //       connect: { id: analysisTask.id },
    //     },
    //   },
    // });

    // await this.prismaService.client.valve.create({
    //   data: {
    //     tag: 'test4',
    //     factoryId: analysisTask.factoryId,
    //     analysisTask: {
    //       connect: { id: analysisTask.id },
    //     },
    //   },
    // });

    try {
      const { data } = await firstValueFrom(
        this.httpService.post('http://localhost:5050/api/frasepdf', params),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        '分析任务执行错误，请联系工作人员',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async clear() {
    const pdfs = await this.prismaService.client.pdf.findMany();
    pdfs.forEach(async (item) => {
      const url = item.url.split('?')[0];
      await this.prismaService.client.pdf.update({
        where: { id: item.id },
        data: { url },
      });
    });
    return 'success';
  }

  async execute2(user: ActiveUserData, id: number) {
    // 获取分析任务的数据
    const analysisTask =
      await this.prismaService.client.analysisTask.findUnique({
        where: { id },
        include: { pdf: true },
      });
    // 把任务状态改为执行中
    // await this.prismaService.client.analysisTask.update({
    //   where: { id },
    //   data: { status: 1 },
    // });
    // 获取解析模板的数据
    const data = await this.prismaService.client.dictData.findMany({
      where: { dictTypeId: analysisTask.dictTypeId },
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

      // 写入到 json 文件中
      // fs.writeFileSync('pdf-zh.json', JSON.stringify(pdfStringData, null, 2));

      const indexes = pdfStringData.reduce((result, item, index) => {
        if (item === 'HART 标签名称' || item === 'HART Tag Name') {
          result.push(index);
        }
        return result;
      }, []);
      const result = indexes.map((item, index) => {
        if (index === indexes.length - 1) {
          return pdfStringData.slice(item - 3, pdfStringData.length);
        } else {
          return pdfStringData.slice(item - 3, indexes[index + 1] - 3);
        }
      });
      result.forEach((item) => {
        this.savePdfData(item, data, analysisTask);
      });
    });
    const pdf = await axios({
      method: 'get',
      url: analysisTask.pdf[0].url,
      responseType: 'arraybuffer',
    });
    pdfParser.parseBuffer(pdf.data);
  }

  async savePdfData(
    pdfStringData: string[],
    data: DictData[],
    analysisTask: AnalysisTask,
  ) {
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
          const conditions = new Map<
            string,
            { unit: string; prevText: string }
          >([
            ['行程', { unit: '%', prevText: '' }],
            ['循环计数', { unit: 'counts', prevText: '' }],
            ['行程累计器', { unit: '%', prevText: '' }],
            ['行程偏差', { unit: '%', prevText: '行程' }],
            ['驱动信号', { unit: '%', prevText: '供气压力' }],
          ]);

          if (conditions.has(text)) {
            const condition = conditions.get(text);
            if (condition.unit !== unit) return;
            if (
              condition.prevText &&
              pdfStringData[index - 2] !== condition.prevText
            )
              return;
          }
          if (text === '标定日期') {
            params.unit = null;
            // params.value = '11 Oct 2023';
            params.value = value;
          }
          result.push(params);
        }
      }
    });
    const tag = result.find((item) => item.name === 'HART 标签').value;
    const date = result.find((item) => item.name === '标定日期').value; // 12 Jul 2023
    // 格式化从pdf中获取的日期
    const time = dayjs(date, 'DD MMM YYYY').toDate();
    const valveData = result.map((item) => {
      return {
        name: item.name,
        value: item.value,
        unit: item.unit || null,
        time,
      };
    });
    const valve = await this.prismaService.client.valve.findFirst({
      where: { factoryId: analysisTask.factoryId, tag },
      include: { valveData: true },
    });
    try {
      if (valve) {
        // 通过time判断是否是否是最新的数据
        if (
          valve.valveData.length === 0 ||
          dayjs(valve.valveData[0].time).isBefore(time)
        ) {
          await this.prismaService.client.valve.update({
            where: { id: valve.id },
            data: {
              valveData: {
                deleteMany: {},
                createMany: { data: valveData },
              },
            },
          });
        }
        // 判断该日期在历史记录表中是否已经存在
        const history =
          await this.prismaService.client.valveHistoryDataList.findFirst({
            where: { valveId: valve.id, time },
          });
        if (history) {
          // 更新历史记录表
          await this.prismaService.client.valveHistoryDataList.update({
            where: { id: history.id },
            data: {
              valveHistoryData: {
                deleteMany: {},
                createMany: { data: valveData },
              },
            },
          });
        } else {
          await this.prismaService.client.valveHistoryDataList.create({
            data: {
              tag,
              time,
              valveId: valve.id,
              valveHistoryData: { createMany: { data: valveData } },
            },
          });
        }
      } else {
        // 创建阀门
        await this.prismaService.client.valve.create({
          data: {
            factoryId: analysisTask.factoryId,
            tag,
            valveData: { createMany: { data: valveData } },
            valveHistoryDataList: {
              create: {
                tag,
                time,
                valveHistoryData: { createMany: { data: valveData } },
              },
            },
          },
        });
      }
      // 把任务状态改为已完成
      await this.prismaService.client.analysisTask.update({
        where: { id: analysisTask.id },
        data: { status: 2 },
      });
      // 保存分析结果
      await this.prismaService.client.analysisTaskResult.upsert({
        where: { analysisTaskId: analysisTask.id },
        create: {
          analysisTaskId: analysisTask.id,
          tag,
          time,
          data: valveData as unknown as Prisma.JsonArray,
        },
        update: {
          tag,
          time,
          data: valveData as unknown as Prisma.JsonArray,
        },
      });
    } catch {
      // 把任务状态改为失败
      await this.prismaService.client.analysisTask.update({
        where: { id: analysisTask.id },
        data: { status: 3 },
      });
    }
  }

  async result(id: number) {
    return this.prismaService.client.analysisTaskResult.findMany({
      where: { analysisTaskId: id },
    });
  }

  async uploadPdf(
    user: ActiveUserData,
    file: Express.Multer.File,
    body: uploadDto,
  ) {
    // 加上时间戳，避免文件名重复
    const fileName = `${Date.now()}-${body.fileName}`;
    await this.minioClient.uploadFile('pdf', fileName, file.buffer);
    const url = await this.minioClient.getUrl('pdf', fileName);
    const urlWithoutParams = url.split('?')[0];
    return { url: urlWithoutParams, name: fileName };
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

  removeAll() {
    return this.prismaService.client.analysisTask.deleteMany({});
  }
}
