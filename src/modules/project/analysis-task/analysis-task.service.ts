import { Inject, Injectable } from '@nestjs/common';
import {
  CreateAnalysisTaskDto,
  ExecuteAnalysisTaskDto,
  QueryAnalysisTaskDto,
  UpdateAnalysisTaskDto,
} from './analysis-task.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class AnalysisTaskService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly minioClient: MinioService,
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
    const { name, status, factoryId, page, pageSize } = queryAnalysisTaskDto;
    const [rows, meta] = await this.prismaService.client.analysisTask
      .paginate({
        where: { name: { contains: name }, factoryId, status },
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

  execute(
    user: ActiveUserData,
    executeAnalysisTaskDto: ExecuteAnalysisTaskDto,
  ) {
    console.log('executeAnalysisTaskDto', executeAnalysisTaskDto);
    return 'This action adds a new analysisTask';
  }

  async uploadPdf(user: ActiveUserData, file: Express.Multer.File) {
    // 加上时间戳，避免文件名重复
    const fileName = `${Date.now()}-${file.originalname}`;
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
