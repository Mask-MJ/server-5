import { Inject, Injectable } from '@nestjs/common';
import {
  CreateFactoryDto,
  QueryFactoryDto,
  UpdateFactoryDto,
} from './factory.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createFactoryDto: CreateFactoryDto) {
    return this.prismaService.client.factory.create({
      data: { ...createFactoryDto, createBy: user.account },
    });
  }

  findAll(queryFactoryDto: QueryFactoryDto) {
    const { name, beginTime, endTime } = queryFactoryDto;
    return this.prismaService.client.factory.findMany({
      where: {
        name: { contains: name },
        createdAt: { gte: beginTime, lte: endTime },
      },
      include: { children: true },
    });
  }

  findOne(id: number) {
    return this.prismaService.client.factory.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateFactoryDto: UpdateFactoryDto) {
    return this.prismaService.client.device.update({
      where: { id },
      data: { ...updateFactoryDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.factory.delete({ where: { id } });
  }
}
