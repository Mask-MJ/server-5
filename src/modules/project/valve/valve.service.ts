import { Inject, Injectable } from '@nestjs/common';
import {
  CreateValveDto,
  QueryValveDto,
  QueryValveHistoryListDto,
  UpdateValveDto,
} from './valve.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ValveService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @Inject(HttpService)
    private readonly httpService: HttpService,
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

  findRunInfo(id: number) {
    return this.prismaService.client.valveData.findMany({
      where: { valveId: id },
    });
  }

  async findAllHistoryDataList(
    queryValveHistoryListDto: QueryValveHistoryListDto,
  ) {
    const { valveId, page, pageSize } = queryValveHistoryListDto;
    const [rows, meta] = await this.prismaService.client.valveHistoryDataList
      .paginate({
        where: { valveId },
        include: { valveHistoryData: true },
        // 根据读取时间倒序排列
        orderBy: { time: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findHistoryData(id: number) {
    return this.prismaService.client.valveHistoryData.findMany({
      where: { valveHistoryDataListId: id },
    });
  }

  async findScoreData(id: number) {
    const valveScore = await firstValueFrom(
      this.httpService.post('http://localhost:5050/api/score', {
        ruleid: 1,
        valveid: id,
      }),
    );
    return valveScore.data?.detail?.scores;
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
