import { Inject, Injectable } from '@nestjs/common';
import { CreateValveDto, QueryValveDto, UpdateValveDto } from './valve.dto';
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
    const { name, factoryId, deviceId, analysisTaskId, page, pageSize } =
      queryValveDto;
    console.log('analysisTaskId', analysisTaskId);
    const [rows, meta] = await this.prismaService.client.valve
      .paginate({
        where: {
          name: { contains: name },
          factoryId,
          deviceId,
          analysisTaskId,
        },
        include: { factory: true, device: true },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.valve.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateValveDto: UpdateValveDto) {
    return this.prismaService.client.device.update({
      where: { id },
      data: { ...updateValveDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.valve.delete({ where: { id } });
  }
}
