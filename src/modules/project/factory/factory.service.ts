import {
  Inject,
  Injectable,
  InternalServerErrorException,
  StreamableFile,
  Logger,
} from '@nestjs/common';
import {
  chartDto,
  CreateFactoryDto,
  importDto,
  QueryFactoryDto,
  reportDto,
  UpdateFactoryDto,
} from './factory.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { read, utils } from 'xlsx';
import dayjs from 'dayjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { readFileSync } from 'fs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { patchDocument, PatchType, TextRun } from 'docx';
// import { mockReport } from './mock';
import {
  table_alarm,
  chart_valves_health_overview,
  chart_values_alarm_overivew,
  chart_valves_quarter,
  table_valves_health_month,
  detail_valves_alarm,
  // table_dynamic_control_month,
  table_valves_travel_month,
  ValveTravelHistoryRecord,
  table_cyclecount_travelaccumulate,
} from './report.helper';
import { MinioService } from 'src/common/minio/minio.service';
import { Valve } from '@prisma/client';
import { getLast12Months } from 'src/common/utils';
import { ValveService } from '../valve/valve.service';
// import { mockValve } from './mock';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,

    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,

    @Inject(HttpService)
    private readonly httpService: HttpService,

    private readonly minioClient: MinioService,
    private readonly logger: Logger,

    private readonly valveService: ValveService,
  ) {}
  create(user: ActiveUserData, createFactoryDto: CreateFactoryDto) {
    return this.prismaService.client.factory.create({
      data: { ...createFactoryDto, createBy: user.account },
    });
  }

  async findAll(user: ActiveUserData, queryFactoryDto: QueryFactoryDto) {
    const { name, beginTime, endTime, filterId } = queryFactoryDto;
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    if (userData.isAdmin) {
      return this.prismaService.client.factory.findMany({
        where: {
          name: { contains: name, mode: 'insensitive' },
          parentId: !name ? null : undefined,
          NOT: { id: filterId },
          createdAt: { gte: beginTime, lte: endTime },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          children: {
            where: { NOT: { id: filterId } },
            include: {
              children: {
                where: { NOT: { id: filterId } },
                include: { children: { where: { NOT: { id: filterId } } } },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } else {
      const roleIds = userData.role.map((item) => item.id);
      return this.prismaService.client.factory.findMany({
        where: {
          NOT: { id: filterId },
          OR: [
            { createBy: user.account },
            { role: { some: { id: { in: roleIds } } } },
          ],
          name: { contains: name, mode: 'insensitive' },
          parentId: !name ? null : undefined,
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: {
          children: {
            where: { NOT: { id: filterId } },
            orderBy: { createdAt: 'desc' },
            include: {
              children: {
                where: { NOT: { id: filterId } },
                include: {
                  children: { where: { NOT: { id: filterId } } },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async findAllList(user: ActiveUserData) {
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    if (userData.isAdmin) {
      // 如果是管理员，返回所有工厂
      // 并且返回工厂下所有阀门的数量
      return this.prismaService.client.factory.findMany({
        include: {
          _count: {
            select: { valve: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const roleIds = userData.role.map((item) => item.id);

      return this.prismaService.client.factory.findMany({
        where: {
          OR: [
            { createBy: user.account },
            { role: { some: { id: { in: roleIds } } } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { valve: true },
          },
        },
      });
    }
  }

  async import(
    user: ActiveUserData,
    file: Express.Multer.File,
    body: importDto,
  ) {
    const workbook = read(file.buffer, { type: 'buffer' });
    const xlsx = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    xlsx.shift();
    const deviceNames: string[] = [];
    xlsx.forEach((item: Valve) => {
      // 获取所有的 装置 名称
      if (item.unit && !deviceNames.includes(item.unit)) {
        deviceNames.push(item.unit);
      }
    });
    deviceNames.forEach(async (deviceName) => {
      let device = await this.prismaService.client.device.findFirst({
        where: { name: deviceName, factoryId: body.factoryId },
      });
      if (!device) {
        device = await this.prismaService.client.device.create({
          data: {
            name: deviceName,
            factoryId: body.factoryId,
            createBy: user.account,
          },
        });
      }
      xlsx
        .filter((item: Valve) => item.unit === deviceName)
        .forEach(async (item: Valve) => {
          const valve = await this.prismaService.client.valve.findFirst({
            where: { tag: item.tag, factoryId: body.factoryId },
          });
          const data = {
            no: String(item.no),
            tag: String(item.tag),
            unit: String(item.unit),
            fluidName: String(item.fluidName),
            criticalApplication: String(item.criticalApplication),
            serialNumber: String(item.serialNumber),
            since:
              (item.since &&
                dayjs(
                  (item.since as unknown as string).slice(0, -1),
                ).toDate()) ||
              null,
            valveBrand: String(item.valveBrand),
            valveSize: String(item.valveSize),
            valveEndConnection: String(item.valveEndConnection),
            valveBodyMaterial: String(item.valveBodyMaterial),
            valveBonnet: String(item.valveBonnet),
            valveTrim: String(item.valveTrim),
            valveSeatLeakage: String(item.valveSeatLeakage),
            valveDescription:
              String(item.valveDescription) ||
              item.serialNumber +
                item.valveSize +
                item.valveBrand +
                item.valveEndConnection +
                item.valveBonnet +
                item.valveTrim +
                item.valveBodyMaterial +
                item.valveSeatLeakage +
                item.valveSeries +
                item.valveRating +
                item.valveStemSize +
                item.valveCv,
            actuatorBrand: String(item.actuatorBrand),
            actuatorSize: String(item.actuatorSize),
            handwheel: String(item.handwheel),
            actuatorDescription:
              String(item.actuatorDescription) ||
              item.actuatorBrand +
                item.actuatorSeries +
                item.actuatorSize +
                item.failurePosition,
            positionerBrand: String(item.positionerBrand),
            positionerModel: String(item.positionerModel),
            positionerDescription:
              String(item.positionerDescription) ||
              item.positionerBrand + item.positionerModel,
            sovBrand: String(item.sovBrand),
            sovModel: String(item.sovModel),
            sovQty: item.sovQty ? Number(item.sovQty) : null,
            sovDescription:
              String(item.sovDescription) ||
              item.sovBrand + item.sovModel + item.sovQty,
            lsBrand: String(item.lsBrand),
            lsModel: String(item.lsModel),
            lsQty: item.lsQty ? Number(item.lsQty) : null,
            lsDescription:
              String(item.lsDescription) ||
              item.lsBrand + item.lsModel + item.lsQty,
            tripValveBrand: String(item.tripValveBrand),
            tripValveModel: String(item.tripValveModel),
            tripValveDescription:
              String(item.tripValveDescription) ||
              item.tripValveBrand + item.tripValveModel,
            vbBrand: String(item.vbBrand),
            vbModel: String(item.vbModel),
            vbQty: item.vbQty ? Number(item.vbQty) : null,
            vbDescription:
              String(item.vbDescription) ||
              item.vbBrand + item.vbModel + item.vbQty,
            qeBrand: String(item.qeBrand),
            qeModel: String(item.qeModel),
            qeQty: item.qeQty ? Number(item.qeQty) : null,
            qeDescription:
              String(item.qeDescription) ||
              item.qeBrand + item.qeModel + item.qeQty,
            pilotBrand: String(item.pilotBrand),
            pilotModel: String(item.pilotModel),
            pilotQty: item.pilotQty ? Number(item.pilotQty) : null,
            pilotDescription:
              String(item.pilotDescription) ||
              item.pilotBrand + item.pilotModel + item.pilotQty,
            valveStemSize: String(item.valveStemSize),
            stroke: String(item.stroke),
            signalComparatorBrand: String(item.signalComparatorBrand),
            signalComparatorModel: String(item.signalComparatorModel),
            signalComparatorDescription:
              String(item.signalComparatorDescription) ||
              item.signalComparatorBrand + item.signalComparatorModel,
            parts: String(item.parts),
            valveRating: String(item.valveRating),
            deviceId: device.id,
            factoryId: body.factoryId,
            updateBy: user.account,
          };
          if (valve) {
            await this.prismaService.client.valve.update({
              where: { id: valve.id },
              data,
            });
            // 记录有多少个阀门被更新
          } else {
            await this.prismaService.client.valve.create({ data });
          }
        });
    });
    return { success: true };
  }

  async getChartData(id: number) {
    const valveBrandGroup = (
      await this.prismaService.client.valve.groupBy({
        by: ['valveBrand'],
        _count: true,
        where: { NOT: { valveBrand: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.valveBrand, value: item._count }));
    const valveTotal = await this.prismaService.client.valve.count({
      where: { factoryId: id },
    });

    const positionerModelGroup = (
      await this.prismaService.client.valve.groupBy({
        by: ['positionerModel'],
        _count: true,
        where: { NOT: { positionerModel: '' }, factoryId: id },
      })
    ).map((item) => ({ name: item.positionerModel, value: item._count }));

    //  根据月份分组统计分析任务数量
    const taskGroupByYear = await Promise.all(
      getLast12Months().map(async ({ start, end, label }) => ({
        name: label,
        value: await this.prismaService.client.analysisTask.count({
          where: { factoryId: id, createdAt: { gte: start, lte: end } },
        }),
      })),
    );

    // 根据月份分组统计维修工单数量
    const maintenanceWorkOrderGroupByYear = await Promise.all(
      getLast12Months().map(async ({ start, end, label }) => ({
        name: label,
        value: await this.prismaService.client.workOrder.count({
          where: {
            factoryId: id,
            type: 1,
            createdAt: { gte: start, lte: end },
          },
        }),
      })),
    );
    // 根据月份分组统计服务工单数量
    const serviceWorkOrderGroupByYear = await Promise.all(
      getLast12Months().map(async ({ start, end, label }) => ({
        name: label,
        value: await this.prismaService.client.workOrder.count({
          where: {
            factoryId: id,
            type: 0,
            createdAt: { gte: start, lte: end },
          },
        }),
      })),
    );

    // 获取30天内创建的维修工单
    const maintenanceWorkOrderList = (
      await this.prismaService.client.workOrder.findMany({
        where: {
          factoryId: id,
          type: 1,
          createdAt: {
            gte: dayjs().subtract(30, 'day').toISOString(),
            lte: dayjs().toISOString(),
          },
        },
        include: { factory: true, valve: true },
        orderBy: { createdAt: 'desc' },
      })
    ).map((item) => {
      return {
        ...item,
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    // 获取30天内创建的现场工单
    const serviceWorkOrderList = (
      await this.prismaService.client.workOrder.findMany({
        where: {
          factoryId: id,
          type: 0,
          createdAt: {
            gte: dayjs().subtract(30, 'day').toISOString(),
            lte: dayjs().toISOString(),
          },
        },
        include: { factory: true, valve: true },
        orderBy: { createdAt: 'desc' },
      })
    ).map((item) => {
      return {
        ...item,
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    // 获取30天内创建的分析任务
    const taskList = (
      await this.prismaService.client.analysisTask.findMany({
        where: {
          factoryId: id,
          createdAt: {
            gte: dayjs().subtract(30, 'day').toISOString(),
            lte: dayjs().toISOString(),
          },
        },
        include: { factory: true },
        orderBy: { createdAt: 'desc' },
      })
    ).map((item) => {
      return {
        ...item,
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });

    return {
      valveTotal,
      valveBrandGroup,
      positionerModelGroup,
      taskGroupByYear,
      maintenanceWorkOrderGroupByYear,
      serviceWorkOrderGroupByYear,
      maintenanceWorkOrderList,
      serviceWorkOrderList,
      taskList,
    };
  }

  async getChartData2(body: chartDto) {
    // const { deviceId } = body;
    // const result = mockValve.detail;
    // console.log(deviceId);
    // if (deviceId === 1) {
    //   result.alertIndicator = [];
    // }
    const result = (
      await firstValueFrom(
        this.httpService.post(
          'http://localhost:5050/api/report/valveCategoricalStatistics',
          body,
        ),
      )
    ).data.detail;
    return result;
  }

  async findReport(reportData: reportDto) {
    let name = '导入的';
    console.log(reportData);
    let valveIdList: number[] = [];
    if (reportData.valveTags?.length) {
      const valveIds = await this.prismaService.client.valve.findMany({
        where: {
          tag: { in: reportData.valveTags },
          factoryId: reportData.factoryId,
        },
        select: { id: true },
      });
      valveIdList = valveIds.map((item) => item.id);
    } else if (reportData.factoryId) {
      const factory = await this.prismaService.client.factory.findUnique({
        where: { id: reportData.factoryId },
      });
      name = factory.name;
    } else if (reportData.analysisTaskId) {
      const analysisTask =
        await this.prismaService.client.analysisTask.findUnique({
          where: { id: reportData.analysisTaskId },
        });
      name = analysisTask.name;
    }
    try {
      const params = {
        ...reportData,
        valveIdList,
      };
      this.logger.log('获取报告数据参数', JSON.stringify(params));
      const result = (
        await firstValueFrom(
          this.httpService.post(
            'http://localhost:5050/api/report/factoryReport',
            // 'http://39.105.100.190:5050/api/report/factoryReport',
            params,
          ),
        )
      ).data.detail;
      this.logger.log('获取报告数据', result);
      // const result = mockReport;
      // console.log(scoreDistribution);
      // 从 public 文件夹获取 docx 模板文件
      const data = readFileSync('public/vcm_report_template_cn.docx', 'binary');

      const docBuffer = await patchDocument({
        outputType: 'nodebuffer',
        data,
        patches: {
          report_time: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun({ text: dayjs().format('YYYY年MM月DD日') })],
          },
          report_for: {
            type: PatchType.PARAGRAPH,
            children: [new TextRun({ text: name })],
          },
          chart_valves_health_overview: chart_valves_health_overview(
            result.scoreDistribution,
          ),
          chart_values_alarm_overivew: chart_values_alarm_overivew(
            result.valveOverallStatus,
          ),
          table_alarm_new: table_alarm(result.newProblem),
          table_alarm_known: table_alarm(result.oldProblem),
          chart_valves_quarter: chart_valves_quarter(result.valveQuarterStatus),
          table_valves_health_month: table_valves_health_month(
            result.valveQuarterStatusTrend,
          ),
          detail_valves_alarm: detail_valves_alarm(result.valveDetails),
          // table_dynamic_control_month: table_dynamic_control_month(
          //   result.valveDynamicControl,
          // ),
          table_valves_travel_month: table_valves_travel_month(
            result.valveTravelHistoryRecord as ValveTravelHistoryRecord[][],
          ),
          table_cyclecount_travelaccumulate: table_cyclecount_travelaccumulate(
            result.cycleAccumulation,
          ),
        },
      });

      const streamOption = {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=utf-8',
        disposition: `attachment; filename*=UTF-8''${encodeURIComponent(
          `${dayjs().format('YYYY-MM-DD')} ${name}阀门报告.docx`,
        )}`,
      };
      return new StreamableFile(docBuffer as any, streamOption);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('获取数据失败, 请联系技术人员');
    }
  }

  findOne(id: number) {
    return this.prismaService.client.factory.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateFactoryDto: UpdateFactoryDto) {
    return this.prismaService.client.factory.update({
      where: { id },
      data: { ...updateFactoryDto, updateBy: user.account },
    });
  }

  async remove(user: ActiveUserData, id: number, ip: string) {
    const factory = await this.prismaService.client.factory.delete({
      where: { id },
    });
    this.eventEmitter.emit('delete', {
      title: `删除ID为${id}, 名称为${factory.name}的工厂`,
      businessType: 2,
      module: '工厂管理',
      account: user.account,
      ip,
    });
    return '删除成功';
  }

  async removeAll(user: ActiveUserData, ip: string) {
    await this.prismaService.client.factory.deleteMany({});
    this.eventEmitter.emit('delete', {
      title: `删除所有工厂`,
      businessType: 2,
      module: '工厂管理',
      account: user.account,
      ip,
    });
    return '删除成功';
  }
}
