import { Inject, Injectable } from '@nestjs/common';
import {
  CreateValveDto,
  QueryValveDto,
  QueryValveHistoryDto,
  UpdateValveDto,
} from './valve.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class ValveService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(user: ActiveUserData, createValveDto: CreateValveDto) {
    return this.prismaService.client.valve.create({
      data: { ...createValveDto, createBy: user.account },
    });
  }

  async findAll(queryValveDto: QueryValveDto) {
    const { tag, factoryId, deviceId, analysisTaskId, page, pageSize } =
      queryValveDto;
    const [rows, meta] = await this.prismaService.client.valve
      .paginate({
        where: {
          tag: { contains: tag },
          factoryId,
          deviceId,
          analysisTaskId,
        },
        include: { factory: true, device: true },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.valve.findUnique({ where: { id } });
  }

  async findHistory(id: number, queryValveHistoryDto: QueryValveHistoryDto) {
    const { page, pageSize, beginTime, endTime } = queryValveHistoryDto;
    const [rows, meta] = await this.prismaService.client.valveDataHistory
      .paginate({
        where: { valveId: id, time: { gte: beginTime, lte: endTime } },
        orderBy: { time: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  update(id: number, user: ActiveUserData, updateValveDto: UpdateValveDto) {
    return this.prismaService.client.valve.update({
      where: { id },
      data: { ...updateValveDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.valve.delete({ where: { id } });
  }
}
