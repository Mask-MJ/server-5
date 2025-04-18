import { Inject, Injectable } from '@nestjs/common';
import { CreateServiceAppDto } from './service.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class ServiceAppService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  async create(createServiceAppDto: CreateServiceAppDto) {
    console.log(createServiceAppDto);
    const { id, endUser, valves, workSheet, ...rest } = createServiceAppDto;
    try {
      // 判断是否存在 serial 相同的工单 如果存在则更新,否则创建
      const existingWorkOrder =
        await this.prismaService.client.workOrder.findFirst({
          where: { serial: createServiceAppDto.serial },
        });
      // 判断是否存在 endUser 名称相同的 factory 如果存在则更新,否则创建
      let existingFactory = await this.prismaService.client.factory.findFirst({
        where: { name: endUser.name },
      });
      if (existingFactory) {
        // 更新工厂
        await this.prismaService.client.factory.update({
          where: { id: existingFactory.id },
          data: { ...endUser, createBy: 'serviceApp' },
        });
      } else {
        // 创建工厂
        existingFactory = await this.prismaService.client.factory.create({
          data: { ...endUser, createBy: 'serviceApp' },
        });
      }
      // 判断该工厂是否存在阀门 如果存在则更新,否则创建
      valves.forEach(async (valve) => {
        const existingValve = await this.prismaService.client.valve.findFirst({
          where: { factoryId: existingFactory.id, tag: valve.tag },
        });
        if (existingValve) {
          // 更新阀门
          await this.prismaService.client.valve.update({
            where: { id: existingValve.id },
            data: { ...valve, factoryId: existingFactory.id },
          });
        } else {
          // 创建阀门
          await this.prismaService.client.valve.create({
            data: { ...valve, factoryId: existingFactory.id },
          });
        }
      });
      if (existingWorkOrder) {
        // 更新工单
        await this.prismaService.client.workOrder.update({
          where: { id: existingWorkOrder.id },
          data: { ...rest, serviceAppId: id },
        });
      } else {
        // 创建工单
        await this.prismaService.client.workOrder.create({
          data: {
            serviceAppId: id,
            ...rest,
            factoryId: existingFactory.id,
            taskDescription: workSheet.taskDescription,
            possibleCauseAnalysis: workSheet.possibleCauseAnalysis,
            faultCategory: workSheet.faultCategory,
            remedialActions: workSheet.remedialActions,
            recommendation: workSheet.recommendation,
          },
        });
      }
      return 'success';
    } catch (error) {
      console.log(error);
      return new Error('error', error);
    }
  }
}
