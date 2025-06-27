import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateValveDto,
  QueryValveChartDto,
  QueryValveDto,
  QueryValveHistoryListDto,
  QueryValveWorkOrderDto,
  UpdateValveDto,
  ValveHistoryScoreDto,
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
    const {
      serialNumber,
      valveBrand,
      valveSize,
      valveEndConnection,
      valveBodyMaterial,
      valveSeatLeakage,
      valveSeries,
      valveRating,
      valveStemSize,
      valveCv,
      valveBonnet,
      valveTrim,
      actuatorBrand,
      actuatorType,
      actuatorSize,
      failurePosition,
      positionerBrand,
      positionerModel,
      lsBrand,
      lsModel,
      lsQty,
      pilotBrand,
      pilotModel,
      pilotQty,
      qeBrand,
      qeModel,
      qeQty,
      regulatorBrand,
      regulatorModel,
      signalComparatorBrand,
      signalComparatorModel,
      sovBrand,
      sovModel,
      sovQty,
      tripValveBrand,
      tripValveModel,
      vbBrand,
      vbModel,
      vbQty,
    } = createValveDto;
    // 阀体描述
    const valveDescription =
      createValveDto.valveDescription ||
      serialNumber +
        valveBrand +
        valveSize +
        valveEndConnection +
        valveBonnet +
        valveTrim +
        valveBodyMaterial +
        valveSeatLeakage +
        valveSeries +
        valveRating +
        valveStemSize +
        valveCv;
    // 执行机构描述
    const actuatorDescription =
      createValveDto.actuatorDescription ||
      actuatorBrand + actuatorType + actuatorSize + failurePosition;
    // 定位器描述
    const positionerDescription =
      createValveDto.positionerDescription || positionerBrand + positionerModel;
    // 限位开关描述
    const lsDescription =
      createValveDto.lsDescription || lsBrand + lsModel + lsQty;
    // 气控阀描述
    const pilotDescription =
      createValveDto.pilotDescription || pilotBrand + pilotModel + pilotQty;
    // 快排阀描述
    const qeDescription =
      createValveDto.qeDescription || qeBrand + qeModel + qeQty;
    // 过滤减压阀描述
    const regulatorDescription =
      createValveDto.regulatorDescription || regulatorBrand + regulatorModel;
    // 信号比较器描述
    const signalComparatorDescription =
      createValveDto.signalComparatorDescription ||
      signalComparatorBrand + signalComparatorModel;
    // 电磁阀描述
    const sovDescription =
      createValveDto.sovDescription || sovBrand + sovModel + sovQty;
    // 保位阀描述
    const tripValveDescription =
      createValveDto.tripValveDescription || tripValveBrand + tripValveModel;
    // 放大器描述
    const vbDescription =
      createValveDto.vbDescription || vbBrand + vbModel + vbQty;
    // 创建阀门
    return this.prismaService.client.valve.create({
      data: {
        ...createValveDto,
        valveDescription,
        actuatorDescription,
        positionerDescription,
        lsDescription,
        pilotDescription,
        qeDescription,
        regulatorDescription,
        signalComparatorDescription,
        sovDescription,
        tripValveDescription,
        vbDescription,
        createBy: user.account,
      },
    });
  }

  async findAll(queryValveDto: QueryValveDto) {
    const {
      tag,
      factoryId,
      deviceId,
      valveSeries,
      serialNumber,
      page,
      pageSize,
    } = queryValveDto;
    const [rows, meta] = await this.prismaService.client.valve
      .paginate({
        where: {
          tag: { contains: tag, mode: 'insensitive' },
          factoryId,
          deviceId,
          serialNumber: { contains: serialNumber, mode: 'insensitive' },
          valveSeries: { contains: valveSeries, mode: 'insensitive' },
        },
        include: { factory: true, device: true },
        orderBy: { updatedAt: 'desc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  async findAllExport(queryValveDto: QueryValveDto) {
    const { tag, factoryId, deviceId, valveSeries, serialNumber } =
      queryValveDto;
    return this.prismaService.client.valve.findMany({
      where: {
        tag: { contains: tag, mode: 'insensitive' },
        factoryId,
        deviceId,
        serialNumber: { contains: serialNumber, mode: 'insensitive' },
        valveSeries: { contains: valveSeries, mode: 'insensitive' },
      },
      include: { factory: true, device: true },
    });
  }

  async findOne(id: number) {
    return this.prismaService.client.valve.findUnique({
      where: { id },
      include: {
        factory: true,
        device: true,
        workOrder: {
          include: { factory: true, valve: true },
        },
        analysisTask: true,
      },
    });
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

  async findHistoryData(id: number) {
    return this.prismaService.client.valveHistoryData.findMany({
      where: { valveHistoryDataListId: id },
    });
  }

  async findHistoryChartData(queryValveChartDto: QueryValveChartDto) {
    const { keywordId, valveId, beginTime, endTime } = queryValveChartDto;
    try {
      const valveScore = await firstValueFrom(
        this.httpService.post('http://localhost:5050/api/keywordPlot', {
          keywordId,
          valveId,
          beginTime: dayjs(beginTime).format('YYYY-MM-DD'),
          endTime: dayjs(endTime).format('YYYY-MM-DD'),
        }),
      );
      return valveScore.data;
    } catch (error) {
      throw new InternalServerErrorException('获取数据失败, 请联系技术人员');
    }
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

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prismaService.client.valve.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有阀门`,
      businessType: 2,
      module: '阀门管理',
      account: user.account,
      ip,
    });
    return '删除成功';
  }

  async findHistoryScoreData(queryValveHistoryScoreDto: ValveHistoryScoreDto) {
    const { valveId, page, pageSize } = queryValveHistoryScoreDto;
    console.log(valveId, page, pageSize);
    const valveHistoryScoreDto = await firstValueFrom(
      this.httpService.post('http://localhost:5050/api/historyScore', {
        valveId,
        page,
        pageSize,
      }),
    );
    return valveHistoryScoreDto.data?.detail;
  }

  async findWorkOrder(queryValveWorkOrderDto: QueryValveWorkOrderDto) {
    const { valveId, typeName, type } = queryValveWorkOrderDto;
    return this.prismaService.client.workOrder.findMany({
      where: {
        typeName: { contains: typeName, mode: 'insensitive' },
        type,
        valve: {
          some: { id: valveId },
        },
      },
      include: { factory: true, valve: true },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
