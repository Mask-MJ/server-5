import { Inject, Injectable } from '@nestjs/common';
import {
  CreateValveDto,
  QueryValveChartDto,
  QueryValveDto,
  QueryValveHistoryListDto,
  UpdateValveDto,
} from './valve.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ValveService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    @Inject(HttpService)
    private readonly httpService: HttpService,
    private configService: ConfigService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
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
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findOne(id: number) {
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

  async findHistoryChartData(queryValveChartDto: QueryValveChartDto) {
    const { id, type } = queryValveChartDto;
    const list = await this.prismaService.client.valveHistoryDataList.findMany({
      where: { valveId: id },
      include: {
        valveHistoryData: {
          where: { name: type },
          orderBy: { time: 'desc' },
        },
      },
    });

    const data: Record<string, string[]> = { values: [], times: [] };
    list.forEach((item) => {
      // 判断是否有数据 或 value 为空,不返回
      if (item.valveHistoryData.length) {
        if (item.valveHistoryData[0].value) {
          data.values.push(item.valveHistoryData[0].value);
          data.times.push(
            dayjs(item.valveHistoryData[0].time).format('YYYY-MM-DD'),
          );
        }
      }
    });

    return data;
  }

  async findScoreData(id: number) {
    const valveScore = await firstValueFrom(
      this.httpService.post('http://localhost:5050/api/score', {
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

  async remove(user: ActiveUserData, id: number, ip: string) {
    const valve = await this.prismaService.client.valve.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 位号为${valve.tag}的阀门`,
      businessType: 2,
      module: '阀门管理',
      account: user.account,
      ip,
    });
    return '删除成功';
  }

  async getTreeStructure() {
    const db = new DataSource({
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: 'flask_ocrt',
    });
    const condition = await db.initialize();
    // 查找 TreeStructure 表中的所有数据
    // const result2 = await condition.query(
    //   "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';",
    // );
    const result = await condition.query(
      'SELECT "tagNumber" FROM "FarseAction"',
    );
    return result;
  }
}
