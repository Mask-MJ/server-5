import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { transformationTree } from 'src/common/utils/transformationTree';
import { menuProjectSeed } from './menu-seed';

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
      orderBy: { sort: 'asc' },
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

  async reset() {
    // 删除所有菜单
    await this.prismaService.client.menu.deleteMany({});
    await this.prismaService.client.menu.create({
      data: {
        name: '首页',
        icon: 'i-ant-design:appstore-outlined',
        sort: 1,
        path: '/dashboard',
        type: 'C',
        createBy: 'admin',
        children: {
          create: [
            {
              name: '工作台',
              icon: 'i-ant-design:laptop-outlined',
              sort: 1,
              type: 'M',
              path: '/dashboard/workTable',
              createBy: 'admin',
            },
            {
              name: '地图',
              icon: 'i-ant-design:heat-map-outlined',
              sort: 2,
              type: 'M',
              path: '/dashboard/map',
              createBy: 'admin',
            },
          ],
        },
      },
    });
    // 核心数据管理
    await this.prismaService.client.menu.create(menuProjectSeed);
    // 系统管理
    await this.prismaService.client.menu.create({
      data: {
        name: '系统管理',
        icon: 'i-ant-design:setting-outlined',
        sort: 3,
        path: '/system',
        type: 'C',
        createBy: 'admin',
        children: {
          create: [
            {
              name: '用户管理',
              icon: 'i-ant-design:user-outlined',
              sort: 1,
              path: '/system/user',
              type: 'M',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:user:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:user:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:user:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:user:delete',
                  },
                ],
              },
            },
            {
              name: '角色管理',
              icon: 'i-ant-design:usergroup-add-outlined',
              sort: 2,
              path: '/system/role',
              type: 'M',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:role:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:role:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:role:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:role:delete',
                  },
                ],
              },
            },
            {
              name: '菜单管理',
              icon: 'i-ant-design:menu-outlined',
              sort: 3,
              path: '/system/menu',
              type: 'M',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:menu:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:menu:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:menu:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:menu:delete',
                  },
                ],
              },
            },
            {
              name: '模板管理',
              icon: 'i-ant-design:medicine-box-outlined',
              sort: 4,
              path: '/system/dictType',
              type: 'M',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictType:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictType:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictType:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictType:delete',
                  },
                ],
              },
            },
            {
              name: '关键字管理',
              icon: 'i-ant-design:medicine-box-outlined',
              sort: 5,
              path: '/system/dictData/:id',
              type: 'M',
              hidden: true,
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictData:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictData:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictData:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictData:delete',
                  },
                ],
              },
            },
            {
              name: '部门管理',
              icon: 'i-ant-design:gold-twotone',
              sort: 6,
              path: '/system/dept',
              type: 'M',
              hidden: true,
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dept:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dept:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dept:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dept:delete',
                  },
                ],
              },
            },
            {
              name: '岗位管理',
              icon: 'i-ant-design:golden-filled',
              sort: 7,
              path: '/system/post',
              type: 'M',
              hidden: true,
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:post:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:post:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:post:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:post:delete',
                  },
                ],
              },
            },
            {
              name: '规则管理',
              icon: 'i-ant-design:schedule-outlined',
              sort: 8,
              type: 'M',
              path: '/system/rule',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:rule:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:rule:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:rule:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:rule:delete',
                  },
                ],
              },
            },
            {
              name: 'PDF树管理',
              icon: 'i-ant-design:control-outlined',
              sort: 9,
              path: '/system/dictDataTree',
              createBy: 'admin',
              type: 'M',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictDataTree:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictDataTree:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictDataTree:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:dictDataTree:delete',
                  },
                ],
              },
            },
            {
              name: '单位管理',
              icon: 'i-ant-design:medicine-box-outlined',
              sort: 4,
              path: '/system/unit',
              type: 'M',
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '创建',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:unit:create',
                  },
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:unit:query',
                  },
                  {
                    name: '修改',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:unit:update',
                  },
                  {
                    name: '删除',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'system:unit:delete',
                  },
                ],
              },
            },
          ],
        },
      },
    });
    // 系统监控
    await this.prismaService.client.menu.create({
      data: {
        name: '系统监控',
        icon: 'i-ant-design:android-filled',
        sort: 4,
        type: 'C',
        path: '/monitor',
        createBy: 'admin',
        children: {
          create: [
            {
              name: '在线用户',
              icon: 'i-ant-design:aim-outlined',
              sort: 1,
              path: '/monitor/online',
              type: 'M',
              hidden: true,
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'monitor:online:query',
                  },
                  {
                    name: '强退',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'monitor:online:forceLogout',
                  },
                ],
              },
            },
            {
              name: '登录日志',
              sort: 2,
              icon: 'i-ant-design:contacts-outlined',
              path: '/monitor/loginLog',
              createBy: 'admin',
              type: 'M',
              children: {
                create: [
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'monitor:loginLog:query',
                  },
                ],
              },
            },
            {
              name: '操作日志',
              sort: 3,
              icon: 'i-ant-design:cloud-server-outlined',
              path: '/monitor/operationLog',
              createBy: 'admin',
              type: 'M',
              children: {
                create: [
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'monitor:operationLog:query',
                  },
                ],
              },
            },
            {
              name: '服务器监控',
              icon: 'i-ant-design:fund-projection-screen-outlined',
              sort: 4,
              path: '/monitor/info',
              type: 'M',
              hidden: true,
              createBy: 'admin',
              children: {
                create: [
                  {
                    name: '查询',
                    path: '',
                    type: 'B',
                    createBy: 'admin',
                    permission: 'monitor:info:query',
                  },
                ],
              },
            },
          ],
        },
      },
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
