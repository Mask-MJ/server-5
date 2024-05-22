import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class MenuService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createMenuDto: CreateMenuDto) {
    return this.prismaService.client.menu.create({
      data: { ...createMenuDto, createBy: user.account },
    });
  }

  findAll(queryMenuDto: QueryMenuDto) {
    const { name } = queryMenuDto;
    return this.prismaService.client.menu.findMany({
      where: {
        name: { contains: name },
        parentId: null,
      },
      include: { children: true },
    });
  }

  findOne(id: number) {
    return this.prismaService.client.menu.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateMenuDto: UpdateMenuDto) {
    return this.prismaService.client.menu.update({
      where: { id },
      data: { ...updateMenuDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.menu.delete({ where: { id } });
  }
}
