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

@Injectable()
export class AnalysisTaskService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createAnalysisTaskDto: CreateAnalysisTaskDto) {
    return this.prismaService.client.analysisTask.create({
      data: { ...createAnalysisTaskDto, createBy: user.account },
    });
  }

  async findAll(queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    const { name, status, factoryId, page, pageSize } = queryAnalysisTaskDto;
    const [rows, meta] = await this.prismaService.client.analysisTask
      .paginate({
        where: {
          name: { contains: name },
          factoryId,
          status,
        },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.analysisTask.findUnique({ where: { id } });
  }

  execute(
    user: ActiveUserData,
    executeAnalysisTaskDto: ExecuteAnalysisTaskDto,
  ) {
    console.log('executeAnalysisTaskDto', executeAnalysisTaskDto);
    return 'This action adds a new analysisTask';
  }

  update(
    id: number,
    user: ActiveUserData,
    updateAnalysisTaskDto: UpdateAnalysisTaskDto,
  ) {
    return this.prismaService.client.analysisTask.update({
      where: { id },
      data: { ...updateAnalysisTaskDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.analysisTask.delete({ where: { id } });
  }
}
