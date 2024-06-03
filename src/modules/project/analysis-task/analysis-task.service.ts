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
import pdf from 'pdf-parse';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

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
      .withPages({ page, limit: pageSize });
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
      });
    const { data } = await firstValueFrom(
      this.httpService.post('http://39.105.100.190:5050/api/frasepdf', {
        projectid: analysisTask.id,
        filepath: ['pdf/DVW-R1_20240307_1534_REPORT中文.pdf'],
        templateid: [0],
        ruleid: 1,
        factoryid: analysisTask.factoryId,
      }),
    );
    if (data.detail.result === 1) {
      await this.prismaService.client.analysisTask.update({
        where: { id },
        data: { status: 1 },
      });
    }
    // 访问另外一个数据库, 获取解析后的数据, 同步到本地数据库

    return data.detail;
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

  execute2() {
    const pdfParser = new PDFParser(this, true);
    pdfParser.on('pdfParser_dataError', (errData) =>
      console.error(errData.parserError),
    );
    // pdfParser.on('pdfParser_dataReady', (pdfData) => {
    //   const data = pdfParser.getRawTextContent();
    //   // fs 写入文件,转换成utf-8格式
    //   // fs.writeFile('./test.json', JSON.stringify(pdfData), (data) =>
    //   //   console.log(data),
    //   // );
    //   // console.log(pdfParser.getRawTextContent());
    //   fs.writeFileSync('./test.json', JSON.stringify(pdfData), 'utf-8');
    // });
    pdfParser.on('pdfParser_dataReady', () => {
      fs.writeFile('./test2.txt', pdfParser.getRawTextContent(), () => {
        console.log('Done.');
      });
    });
    pdfParser.loadPDF('./test.pdf');

    const dataBuffer = fs.readFileSync('./test.pdf');
    pdf(dataBuffer).then(function (data) {
      console.log(data);
      fs.writeFile('./test.txt', data.text, () => {});
    });
    // return data;
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
    return this.prismaService.client.analysisTask.delete({ where: { id } });
  }
}
