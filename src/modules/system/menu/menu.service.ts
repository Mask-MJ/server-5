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
    const suffix = createMenuDto.path
      .replace(/:id$/, '')
      .replace(/^\//, '')
      .replace(/\//g, ':');
    return this.prismaService.client.menu.create({
      data: {
        ...createMenuDto,
        createBy: user.account,
        permission: {
          createMany: {
            data: [
              { name: '创建', value: suffix + ':create' },
              { name: '读取', value: suffix + ':read' },
              { name: '更新', value: suffix + ':update' },
              { name: '删除', value: suffix + ':delete' },
            ],
          },
        },
      },
    });
  }

  async findAll(user: ActiveUserData, queryMenuDto: QueryMenuDto) {
    const { name } = queryMenuDto;
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    if (userData.isAdmin) {
      return this.prismaService.client.menu.findMany({
        where: {
          name: { contains: name },
          parentId: !name ? null : undefined,
        },
        include: { children: { orderBy: { sort: 'asc' } } },
        orderBy: { sort: 'asc' },
      });
    } else {
      const roleIds = userData.role.map((item) => item.id);
      return this.prismaService.client.menu.findMany({
        where: {
          OR: [{ role: { some: { id: { in: roleIds } } } }],
          name: { contains: name },
          parentId: !name ? null : undefined,
        },
        include: { children: { orderBy: { sort: 'asc' } } },
        orderBy: { sort: 'asc' },
      });
    }
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
