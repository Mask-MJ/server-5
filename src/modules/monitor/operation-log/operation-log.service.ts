import { Inject, Injectable } from '@nestjs/common';
import {
  CreateOperationLogDto,
  QueryOperationLogDto,
} from './operation-log.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
@Injectable()
export class OperationLogService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createOperationLogDto: CreateOperationLogDto) {
    return this.prismaService.client.operationLog.create({
      data: createOperationLogDto,
    });
  }

  async findAll(queryOperationLogDto: QueryOperationLogDto) {
    const { page, pageSize, beginTime, endTime, account, businessType } =
      queryOperationLogDto;
    const [rows, meta] = await this.prismaService.client.operationLog
      .paginate({
        where: {
          account: { contains: account },
          businessType,
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return {
      rows,
      ...meta,
    };
  }

  findOne(id: number) {
    return this.prismaService.client.operationLog.findUniqueOrThrow({
      where: { id },
    });
  }
}
