import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateServiceAppDto } from './service.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { Prisma, WorkOrder } from '@prisma/client';

export interface SyncResponse {
  code: number;
  message: string;
}

@Injectable()
export class ServiceAppService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly logger: Logger,
  ) {}
  async create(
    createServiceAppDto: CreateServiceAppDto,
  ): Promise<SyncResponse> {
    this.logger.log(
      '获取ServiceApp传入参数',
      JSON.stringify(createServiceAppDto),
    );
    const { id, endUser, valves, workSheet, ...rest } = createServiceAppDto;
    // 收到推送的时刻,作为创建/更新最终用户(工厂)的时间
    const pushedAt = new Date();

    // 先把原始推送 payload 落库, 失败也留档便于追溯
    // 使用 JSON.parse(JSON.stringify(...)) 把 class 实例转成纯 JSON, 兼容 Prisma Json 字段
    const pushLog = await this.safeCreatePushLog({
      serviceAppId: id,
      serial: createServiceAppDto.serial,
      endUserName: endUser?.name,
      payload: JSON.parse(
        JSON.stringify(createServiceAppDto),
      ) as Prisma.InputJsonValue,
    });
    // 显式白名单: 仅允许业务字段进入 Prisma,主键/审计/时间戳由本服务控制
    const endUserPayload = {
      name: endUser.name,
      status: endUser.status,
      industry: endUser.industry,
      code: endUser.code,
      province: endUser.province,
      city: endUser.city,
      county: endUser.county,
      address: endUser.address,
      longitude: endUser.longitude,
      latitude: endUser.latitude,
      parentId: endUser.parentId,
      remark: endUser.remark,
    };

    try {
      // 整个同步流程包在一个事务里,任一环节失败全部回滚,避免脏数据
      await this.prismaService.client.$transaction(
        async (tx) => {
          // 1. 工厂: 按 name 唯一键 upsert,避免并发同名推送的 race
          const factory = await tx.factory.upsert({
            where: { name: endUser.name },
            create: {
              ...endUserPayload,
              createBy: 'serviceApp',
              createdAt: pushedAt,
              updatedAt: pushedAt,
            },
            update: {
              ...endUserPayload,
              updateBy: 'serviceApp',
              updatedAt: pushedAt,
            },
          });

          // 2. 工单: 按 serial 唯一键 upsert
          const workOrder: WorkOrder = await tx.workOrder.upsert({
            where: { serial: createServiceAppDto.serial },
            create: {
              serviceAppId: id,
              ...rest,
              factoryId: factory.id,
              taskDescription: workSheet.taskDescription,
              possibleCauseAnalysis: workSheet.possibleCauseAnalysis,
              faultCategory: workSheet.faultCategory,
              remedialActions: workSheet.remedialActions,
              recommendation: workSheet.recommendation,
              faultDetail: workSheet.faultDetail,
            },
            update: { ...rest, serviceAppId: id },
          });

          // 3. 装置/阀门: 没有数据库唯一键,事务内顺序处理 findFirst→create/update
          //    (事务底层是单连接,Promise.all 并不会并发执行,反而增加死锁风险)
          for (const data of valves) {
            let device = await tx.device.findFirst({
              where: { factoryId: factory.id, name: data.unit },
            });
            if (!device) {
              device = await tx.device.create({
                data: {
                  name: data.unit,
                  factoryId: factory.id,
                  createBy: 'serviceApp',
                },
              });
            }

            const existingValve = await tx.valve.findFirst({
              where: { factoryId: factory.id, tag: data.tag },
            });
            const valveData = {
              ...data,
              deviceId: device.id,
              factoryId: factory.id,
              workOrder: { connect: workOrder },
            };
            if (existingValve) {
              await tx.valve.update({
                where: { id: existingValve.id },
                data: valveData,
              });
            } else {
              await tx.valve.create({ data: valveData });
            }
          }
        },
        {
          // 阀门数量较多时事务时间会拉长,放宽默认 5s 限制
          timeout: 30_000,
          maxWait: 10_000,
        },
      );

      await this.safeUpdatePushLog(pushLog?.id, { status: 'success' });
      return { code: 200, message: 'success' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'error';
      this.logger.error(
        'ServiceApp 数据同步失败',
        error instanceof Error ? error.stack : String(error),
      );
      await this.safeUpdatePushLog(pushLog?.id, {
        status: 'failed',
        errorMessage: message,
      });
      return { code: 500, message };
    }
  }

  /**
   * 写推送日志, 失败不影响主流程
   */
  private async safeCreatePushLog(data: {
    serviceAppId?: string;
    serial?: string;
    endUserName?: string;
    payload: Prisma.InputJsonValue;
  }): Promise<{ id: number } | null> {
    try {
      return await this.prismaService.client.serviceAppPushLog.create({
        data,
        select: { id: true },
      });
    } catch (error) {
      this.logger.error(
        'ServiceApp 推送日志写入失败',
        error instanceof Error ? error.stack : String(error),
      );
      return null;
    }
  }

  /**
   * 更新推送日志状态, 失败不影响主流程
   */
  private async safeUpdatePushLog(
    id: number | undefined,
    data: { status: string; errorMessage?: string },
  ): Promise<void> {
    if (!id) return;
    try {
      await this.prismaService.client.serviceAppPushLog.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(
        'ServiceApp 推送日志更新失败',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
