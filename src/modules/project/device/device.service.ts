import { Inject, Injectable } from '@nestjs/common';
import { CreateDeviceDto, QueryDeviceDto, UpdateDeviceDto } from './device.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class DeviceService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createDeviceDto: CreateDeviceDto) {
    return this.prismaService.client.device.create({
      data: { ...createDeviceDto, createBy: user.account },
    });
  }

  async findAll(queryDeviceDto: QueryDeviceDto) {
    const { name, page, pageSize } = queryDeviceDto;
    const [rows, meta] = await this.prismaService.client.device
      .paginate({
        where: { name: { contains: name } },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.device.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateDeviceDto: UpdateDeviceDto) {
    return this.prismaService.client.device.update({
      where: { id },
      data: { ...updateDeviceDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.device.delete({ where: { id } });
  }
}
