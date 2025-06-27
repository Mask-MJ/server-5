import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { transformationTree } from 'src/common/utils/transformationTree';

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
        children: {
          create:
            createMenuDto.type === 'M'
              ? [
                  {
                    name: '创建',
                    path: '',
                    permission: suffix + ':create',
                    type: 'B',
                    createBy: user.account,
                  },
                  {
                    name: '读取',
                    path: '',
                    permission: suffix + ':read',
                    type: 'B',
                    createBy: user.account,
                  },
                  {
                    name: '更新',
                    path: '',
                    permission: suffix + ':update',
                    type: 'B',
                    createBy: user.account,
                  },
                  {
                    name: '删除',
                    path: '',
                    permission: suffix + ':delete',
                    type: 'B',
                    createBy: user.account,
                  },
                ]
              : [],
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
    const roleIds = userData.role.map((item) => item.id);
    const menus = await this.prismaService.client.menu.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        type: { not: 'B' }, // 排除按钮类型的菜单
        role: userData.isAdmin ? undefined : { some: { id: { in: roleIds } } },
      },
    });
    return transformationTree(menus, null);
  }

  async findAllWithPermission(
    user: ActiveUserData,
    queryMenuDto: QueryMenuDto,
  ) {
    const { name } = queryMenuDto;
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    const roleIds = userData.role.map((item) => item.id);
    const menus = await this.prismaService.client.menu.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        role: userData.isAdmin ? undefined : { some: { id: { in: roleIds } } },
      },
    });
    return transformationTree(menus, null);
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
