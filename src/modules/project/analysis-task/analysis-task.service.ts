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
import { HttpService } from '@nestjs/axios';
import { DictData, AnalysisTask } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
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
    // 获取分析任务的数据
    const analysisTask =
      await this.prismaService.client.analysisTask.findUnique({
        where: { id },
        include: { pdf: true },
      });
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
          analysisTaskId: analysisTask.id,
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
  }

  async uploadPdf(user: ActiveUserData, file: Express.Multer.File, body: any) {
    // 加上时间戳，避免文件名重复
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
