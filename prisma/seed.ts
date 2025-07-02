import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');
  // create role
  await prisma.role.createMany({
    data: [
      { name: '管理员', value: 'admin', createBy: 'admin' },
      { name: '普通用户', value: 'user', createBy: 'admin' },
    ],
  });
  // create user
  await prisma.user.create({
    data: {
      account: 'admin',
      password: '$2b$10$kxYSbbQSzJ64r4EIcORm8umQB7GQRLNxWAKHmJalYMzkgRZbAaIDq',
      isAdmin: true,
      nickname: '管理员',
      role: { connect: { value: 'admin' } },
    },
  });
  await prisma.user.create({
    data: {
      account: 'test',
      password: '$2b$10$kxYSbbQSzJ64r4EIcORm8umQB7GQRLNxWAKHmJalYMzkgRZbAaIDq',
      isAdmin: false,
      nickname: '普通用户',
      role: { connect: { value: 'user' } },
    },
  });
  // create menu
  await prisma.menu.create({
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
  await prisma.menu.create({
    data: {
      name: '核心数据管理',
      icon: 'i-ant-design:apartment-outlined',
      sort: 2,
      type: 'C',
      path: '/project',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '最终用户',
            icon: 'i-ant-design:cluster-outlined',
            sort: 1,
            path: '/project/factory',
            type: 'M',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '最终用户工作台',
                  icon: 'i-ant-design:cluster-outlined',
                  sort: 1,
                  path: '/project/factory/:id',
                  type: 'M',
                  createBy: 'admin',
                  hidden: true,
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:factory:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:factory:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:factory:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:factory:delete',
                      },
                    ],
                  },
                },
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:factory:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:factory:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:factory:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:factory:delete',
                },
              ],
            },
          },
          {
            name: '装置管理',
            icon: 'i-ant-design:deployment-unit-outlined',
            sort: 2,
            type: 'M',
            path: '/project/device',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:delete',
                },
              ],
            },
          },
          {
            name: '装置列表',
            icon: 'i-ant-design:deployment-unit-outlined',
            sort: 3,
            hidden: true,
            type: 'M',
            path: '/project/device/:id',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:device:delete',
                },
              ],
            },
          },
          {
            name: '阀门管理',
            icon: 'i-ant-design:dashboard-outlined',
            sort: 4,
            type: 'M',
            path: '/project/valve',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '历史数据',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  hidden: true,
                  path: '/project/valve/historyData/:id',
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '历史评分',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  hidden: true,
                  path: '/project/valve/history/:id',
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '工单列表',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  path: '/project/valve/workOrder/:id',
                  hidden: true,
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '阀门列表',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  path: '/project/valve/:id',
                  hidden: true,
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '阀门详情编辑',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  path: '/project/valve/detail/:id',
                  hidden: true,
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '阀门评分',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  path: '/project/valve/score/:id',
                  hidden: true,
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '阀门运行数据',
                  icon: 'i-ant-design:dashboard-outlined',
                  sort: 1,
                  type: 'M',
                  path: '/project/valve/runInfo/:id',
                  hidden: true,
                  createBy: 'admin',
                  children: {
                    create: [
                      {
                        name: '创建',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:create',
                      },
                      {
                        name: '查询',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:query',
                      },
                      {
                        name: '修改',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:update',
                      },
                      {
                        name: '删除',
                        path: '',
                        type: 'B',
                        createBy: 'admin',
                        permission: 'project:valve:delete',
                      },
                    ],
                  },
                },
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:valve:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:valve:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:valve:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:valve:delete',
                },
              ],
            },
          },
          {
            name: '项目管理',
            icon: 'i-ant-design:cloud-server-outlined',
            sort: 6,
            path: '/project/contract',
            createBy: 'admin',
            type: 'M',
            children: {
              create: [
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:delete',
                },
              ],
            },
          },
          {
            name: '项目列表',
            icon: 'i-ant-design:cloud-server-outlined',
            sort: 7,
            hidden: true,
            type: 'M',
            path: '/project/contract/:id',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:contract:delete',
                },
              ],
            },
          },
          {
            name: '分析任务',
            icon: 'i-ant-design:line-chart-outlined',
            sort: 8,
            path: '/project/analysisTask',
            type: 'M',
            createBy: 'admin',
            children: {
              create: [
                {
                  name: '创建',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:delete',
                },
                {
                  name: '执行',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:execute',
                },
              ],
            },
          },
          {
            name: '任务列表',
            icon: 'i-ant-design:line-chart-outlined',
            sort: 9,
            path: '/project/analysisTask/:id',
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
                  permission: 'project:analysisTask:create',
                },
                {
                  name: '查询',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:query',
                },
                {
                  name: '修改',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:update',
                },
                {
                  name: '删除',
                  path: '',
                  type: 'B',
                  createBy: 'admin',
                  permission: 'project:analysisTask:delete',
                },
              ],
            },
          },
        ],
      },
    },
  });
  // 系统管理
  await prisma.menu.create({
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
  await prisma.menu.create({
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
  /// create dictType
  await prisma.dictType.createMany({
    data: [
      { name: 'hart', value: 'hart', createBy: 'admin' },
      { name: 'ff', value: 'ff', createBy: 'admin' },
    ],
  });
  await prisma.dictType.create({
    data: {
      name: '图表字段',
      value: 'chart',
      createBy: 'admin',
      dictData: {
        create: [
          { name: '行程', value: 'Travel', createBy: 'admin' },
          { name: '行程偏差', value: 'Travel Deviation', createBy: 'admin' },
          { name: '供气压力', value: 'Supply Pressure', createBy: 'admin' },
        ],
      },
    },
  });

  // pdf层级树
  await prisma.dictDataTree.create({
    data: {
      name: 'hart',
      value: 'hart',
      children: {
        create: [
          {
            name: '仪表组态-基本',
            value: 'Instrument Configuration-Basic',
            children: {
              create: [
                {
                  name: '设备标识',
                  value: 'Device Identification',
                  children: {
                    create: [
                      {
                        name: '标签',
                        value: 'Tag',
                        children: {
                          create: [
                            { name: 'HART 标签', value: 'HART Tag' },
                            { name: '信息串', value: 'Message' },
                            { name: '描述符', value: 'Descriptor' },
                            {
                              name: '阀门序列号',
                              value: 'Valve Serial Number',
                            },
                            {
                              name: '轮询地址',
                              value: 'Instrument Serial Number',
                            },
                            { name: '仪表序列号', value: 'Polling Address' },
                          ],
                        },
                      },
                      {
                        name: '单位',
                        value: 'Units',
                        children: {
                          create: [
                            { name: '压力单位', value: 'Pressure Units' },
                            { name: '温度单位', value: 'Temperature Units' },
                            { name: '行程单位', value: 'Travel Units' },
                            { name: '长度单位', value: 'Length Units' },
                            { name: '面积单位', value: 'Area Units' },
                            { name: '扭矩单位', value: 'Torque Units' },
                            {
                              name: '弹簧刚度单位',
                              value: 'Spring Rate Units',
                            },
                            {
                              name: '模拟输入单位',
                              value: 'Analog Input Units',
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '初始设置',
                  value: 'Initial Setup',
                  children: {
                    create: [
                      { name: '控制信号', value: 'Control Signal' },
                      { name: '设置', value: 'Setup' },
                    ],
                  },
                },
                {
                  name: '输出',
                  value: 'Outputs',
                  children: {
                    create: [
                      {
                        name: 'HART 变量分配',
                        value: 'HART Variable Assignments',
                      },
                    ],
                  },
                },
                {
                  name: '整定',
                  value: 'Tuning',
                  children: {
                    create: [
                      { name: '行程控制', value: 'Travel Control' },
                      { name: '积分设置', value: 'Integral Settings' },
                      { name: '压力控制', value: 'Pressure Control' },
                    ],
                  },
                },
                {
                  name: '仪表',
                  value: 'Instrument',
                  children: {
                    create: [{ name: '仪表', value: 'Instrument' }],
                  },
                },
                {
                  name: '输入特性化',
                  value: 'Input Characterization',
                },
                {
                  name: '行程/压力控制',
                  value: 'Travel/Pressure Control',
                  children: {
                    create: [
                      { name: '控制', value: 'Control' },
                      { name: '限值/截止', value: 'Limit/Cutoff' },
                      { name: '动态响应', value: 'Dynamic Response' },
                    ],
                  },
                },
                { name: '阵发', value: 'Burst' },
              ],
            },
          },
          {
            name: '仪表组态-报警',
            value: 'Instrument Configuration-Alerts',
            children: {
              create: [
                {
                  name: '行程历史报警',
                  value: 'Travel History Alerts',
                  children: {
                    create: [
                      { name: '循环计数', value: 'Cycle Count' },
                      { name: '行程累计器', value: 'Travel Accumulator' },
                    ],
                  },
                },
                {
                  name: '行程报警',
                  value: 'Travel Alerts',
                  children: {
                    create: [
                      { name: '行程偏差', value: 'Travel Deviation' },
                      { name: '行程高高', value: 'Travel High High' },
                      { name: '行程低低', value: 'Travel Low Low' },
                      { name: '行程高', value: 'Travel High' },
                      { name: '行程低', value: 'Travel Low' },
                      {
                        name: '行程低限位/截止',
                        value: 'Travel Limit/Cutoff Low',
                      },
                      {
                        name: '行程高限位/截止',
                        value: 'Travel Limit/Cutoff High',
                      },
                    ],
                  },
                },
                {
                  name: '信息状态',
                  value: 'Informational Status',
                  children: {
                    create: [
                      {
                        name: '仪表时间为大概值',
                        value: 'Instrument Time is Approximate',
                      },
                      { name: '校验进行中', value: 'Calibration in Progress' },
                      { name: '自动校验进行中', value: 'Autocal in Progress' },
                      { name: '诊断进行中', value: 'Diagnostic in Progress' },
                      {
                        name: '诊断数据可用',
                        value: 'Diagnostic Data Available',
                      },
                      {
                        name: '积分器饱和高',
                        value: 'Integrator Saturated High',
                      },
                      {
                        name: '积分器饱和低',
                        value: 'Integrator Saturated Low',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '仪表组态-报警(控制)',
            value: 'Instrument Configuration-Alerts(cont.)',
            children: {
              create: [
                {
                  name: '压力报警',
                  value: 'Pressure Alerts',
                  children: {
                    create: [
                      { name: '供气压力高', value: 'Supply Pressure High' },
                      { name: '供气压力低', value: 'Supply Pressure Low' },
                      { name: '压力偏差', value: 'Pressure Deviation' },
                      { name: '端口 A 过压', value: 'Port A Overpressurized' },
                    ],
                  },
                },
                {
                  name: '报警记录',
                  value: 'Alert Record',
                  children: {
                    create: [
                      { name: '报警记录非空', value: 'Alert Record Not Empty' },
                      { name: '报警记录已满', value: 'Alert Record Full' },
                    ],
                  },
                },
                {
                  name: '电子报警',
                  value: 'Electronic Alerts',
                  children: {
                    create: [
                      { name: '驱动电流', value: 'Drive Current' },
                      { name: '驱动信号', value: 'Drive Signal' },
                      { name: '非关键 NVM', value: 'Non-Critical NVM' },
                      {
                        name: '闪存完整性故障',
                        value: 'Flash Integrity Failure',
                      },
                      {
                        name: '参考电压故障',
                        value: 'Reference Voltage Failure',
                      },
                      { name: '回路电流', value: 'Loop Current' },
                      { name: '关机激活', value: 'Shutdown Activated' },
                    ],
                  },
                },
                {
                  name: '传感器报警',
                  value: 'Sensor Alerts',
                  children: {
                    create: [
                      { name: '行程传感器', value: 'Travel Sensor' },
                      {
                        name: '压力切换激活',
                        value: 'Pressure Fallback Active',
                      },
                      {
                        name: '温度传感器故障',
                        value: 'Temperature Sensor Failure',
                      },
                      {
                        name: '小回路传感器故障',
                        value: 'Minor Loop Sensor Failure',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '仪表组态-规格表',
            value: 'Instrument Configuration-Spec Sheet',
            children: {
              create: [
                { name: '阀门', value: 'Valve' },
                { name: '内件', value: 'Trim' },
                { name: '执行机构', value: 'Actuator' },
                { name: '附件', value: 'Accessories' },
              ],
            },
          },
          {
            name: '状态监视器',
            value: 'Status Monitor',
            dictData: {
              create: [
                {
                  name: '行程',
                  value: 'Travel',
                  sort: 1,
                  type: '1',
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '供气压力',
                  value: 'Supply Pressure',
                  sort: 2,
                  type: '1',
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '仪表模式',
                  value: 'Instrument Mode',
                  type: '0',
                  sort: 3,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程累计器',
                  value: 'Travel Accumulator',
                  sort: 4,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '放大器调整',
                  value: 'Relay Adjustment',
                  sort: 5,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '最高温度记录',
                  value: 'Max Recorded Temp',
                  type: '1',
                  sort: 6,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '运行时间',
                  value: 'Run Time',
                  type: '1',
                  sort: 7,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '启动次数',
                  value: 'Number of Powerups',
                  type: '1',
                  sort: 8,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '仪表等级',
                  value: 'Instrument Level',
                  type: '0',
                  sort: 9,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '阀门型式',
                  value: 'Valve Style',
                  type: '0',
                  sort: 10,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '执行机构类型',
                  value: 'Spring Actuator Style',
                  type: '0',
                  sort: 11,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '标定日期',
                  value: 'Calibration Date',
                  type: '0',
                  sort: 12,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程高',
                  value: 'Travel High',
                  sort: 13,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程低',
                  value: 'Travel Low',
                  sort: 14,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程高高',
                  value: 'Travel High High',
                  sort: 15,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程低低',
                  value: 'Travel Low Low',
                  sort: 16,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程偏差',
                  value: 'Travel Deviation',
                  sort: 17,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '循环计数高',
                  value: 'Cycle Count High',
                  sort: 18,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程累计高',
                  value: 'Travel Accumulator High',
                  sort: 19,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '供气压力低',
                  value: 'Supply Pressure',
                  sort: 20,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '组态已更改',
                  value: 'Configuration Changed',
                  sort: 21,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '回路电流验证报警',
                  value: 'Loop Current Validation Alert',
                  sort: 22,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '内部传感器超出限制范围',
                  value: 'Internal Sensor Out of Limits',
                  sort: 23,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '变量超出范围',
                  value: 'Variable Out of Range',
                  sort: 24,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '处于标定模式',
                  value: 'In Calibration Mode',
                  sort: 25,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '自动校验进行中',
                  value: 'Autocal in Progress',
                  sort: 26,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '诊断进行中',
                  value: 'Diagnostic in Progress',
                  sort: 27,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '小回路传感器故障',
                  value: 'Minor Loop Sensor Failure',
                  sort: 28,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程传感器故障',
                  value: 'Travel Sensor Failure',
                  sort: 29,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '温度传感器故障',
                  value: 'Temperature Sensor Failure',
                  sort: 30,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '压力传感器故障',
                  value: 'Pressure Sensor Failure',
                  sort: 31,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '驱动电流故障',
                  value: 'Drive Current Failure',
                  sort: 32,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '关键 NVM 故障',
                  value: 'Critical NVM Failure',
                  sort: 33,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '闪存完整性故障',
                  value: 'Flash Integrity Failure',
                  sort: 34,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '参考电压故障',
                  value: 'Reference Voltage Failure',
                  sort: 35,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '报警记录非空',
                  value: 'Alert Record Not Empty',
                  sort: 36,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '报警记录已满',
                  value: 'Alert Record Full',
                  sort: 37,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '积分器饱和高',
                  value: 'Integrator Saturated High',
                  sort: 38,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '积分器饱和低',
                  value: 'Integrator Saturated Low',
                  sort: 39,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '关机激活',
                  value: 'Shutdown Activated',
                  sort: 40,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '压力偏差',
                  value: 'Pressure Deviation',
                  sort: 41,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '非关键 NVM 故障',
                  value: 'Non-Critical NVM Failure',
                  sort: 42,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '仪表时间为大概值',
                  value: 'Instrument Time is Approximate',
                  sort: 43,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '诊断数据可用',
                  value: 'Diagnostic Data Available',
                  sort: 44,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '要求手动复位',
                  value: 'Manual Reset Required',
                  sort: 45,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程高限位/截止',
                  value: 'Travel Limit/Cutoff High',
                  sort: 46,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程低限位/截止',
                  value: 'Travel Limit/Cutoff Low',
                  sort: 47,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '压力切换激活',
                  value: 'Pressure Fallback Active',
                  sort: 48,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '驱动信号',
                  value: 'Drive Signal',
                  sort: 49,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程偏差',
                  value: 'Travel Deviation',
                  sort: 50,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '供气压力高',
                  value: 'Supply Pressure High',
                  sort: 51,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '端口 A 过压',
                  value: 'Port A Overpressurized',
                  sort: 52,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: 'SOV 测试最低要求压降',
                  value: 'SOV Test Min Required Pressure Drop',
                  sort: 53,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: 'SOV 测试最高可允许压降',
                  value: 'SOV Test Max Allowable Pressure Drop',
                  sort: 54,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '循环计数',
                  value: 'Cycle Count',
                  type: '1',
                  sort: 55,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
            children: {
              create: [
                { name: '监视器', value: 'Monitor' },
                { name: '设备', value: 'Device' },
                { name: '报警', value: 'Alerts' },
              ],
            },
          },
          {
            name: '供气压力性能诊断',
            value: 'Supply Pressure Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: '供气压力性能诊断',
                  value: 'Supply Pressure Performance Diagnostic',
                  type: '2',
                  sort: 55,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: '行程偏差性能诊断',
            value: 'Travel Deviation Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: '行程偏差性能诊断',
                  value: 'Travel Deviation Performance Diagnostic',
                  type: '2',
                  sort: 56,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: 'I/P和放大器完整性性能诊断',
            value: 'I/P and Relay Integrity Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: 'I/P和放大器完整性性能诊断',
                  value: 'I/P and Relay Integrity Performance Diagnostic',
                  type: '2',
                  sort: 57,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: '放大器调整性能诊断',
            value: 'Relay Adjustment Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: '放大器调整性能诊断',
                  value: 'Relay Adjustment Performance Diagnostic',
                  type: '2',
                  sort: 58,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: '空气质量流量性能诊断',
            value: 'Air Mass Flow Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: '空气质量流量性能诊断',
                  value: 'Air Mass Flow Performance Diagnostic',
                  type: '2',
                  sort: 59,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: '阀门摩擦力性能诊断',
            value: 'Valve Friction Performance Diagnostic',
            dictData: {
              create: [
                {
                  name: '阀门摩擦力性能诊断',
                  value: 'Valve Friction Performance Diagnostic',
                  type: '2',
                  sort: 93,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '平均扭矩',
                  value: 'Avg. Torque',
                  type: '1',
                  sort: 94,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '平均死区',
                  value: 'Avg. Dead Band',
                  type: '1',
                  sort: 95,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
          },
          {
            name: '完全扫描',
            value: 'Total Scan',
            dictData: {
              create: [
                {
                  name: '扫描时间',
                  value: 'Scan Time',
                  sort: 79,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '平均动态误差',
                  value: 'Avg. Dynamic Error',
                  sort: 80,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '动态线性度（独立）',
                  value: 'Dyn. Linearity (Ind.)',
                  sort: 81,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '平均扭矩',
                  value: 'Average Torque',
                  type: '1',
                  sort: 82,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '弹簧预紧力',
                  value: 'Bench Set',
                  sort: 83,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '测试状态阀座负载',
                  value: 'Seat Load As Tested',
                  sort: 84,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '投用状态阀座负载',
                  value: 'Service Seat Load',
                  sort: 85,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '所需阀座负载',
                  value: 'Required Seat Load',
                  sort: 86,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '预期总摩擦力',
                  value: 'Expected Total Friction',
                  sort: 87,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
            children: {
              create: [
                { name: '输入', value: 'Inputs' },
                { name: '已分析的数据', value: 'Analyzed Data' },
                {
                  name: '组态',
                  value: 'Configuration',
                  children: {
                    create: [
                      { name: '整定', value: 'Tuning' },
                      { name: '增益', value: 'Gains' },
                      { name: '积分设置', value: 'Integral Settings' },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '完全扫描-特性曲线分析器设置',
            value: 'Total Scan-Signature Analyzer Settings',
            children: {
              create: [
                {
                  name: '特性曲线分析器设置',
                  value: 'Signature Analyzer Settings',
                },
              ],
            },
          },
          {
            name: '完全扫描-注释',
            value: 'Total Scan-Notes',
            children: {
              create: [{ name: '注释', value: 'Notes' }],
            },
          },
          {
            name: '完全扫描-规格表',
            value: 'Total Scan-Spec Sheet',
            dictData: {
              create: [
                {
                  name: '额定行程',
                  value: 'Rated Travel',
                  type: '1',
                  sort: 88,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '实际行程：',
                  value: 'Actual Travel',
                  type: '1',
                  sort: 89,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '下方弹簧预紧力',
                  value: 'Lower Bench Set',
                  type: '1',
                  sort: 90,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '上方弹簧预紧力',
                  value: 'Upper Bench Set',
                  type: '1',
                  sort: 91,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '增压器',
                  value: 'Volume Booster',
                  sort: 92,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
            children: {
              create: [
                { name: '阀门', value: 'Valve' },
                { name: '内件', value: 'Trim' },
                { name: '附件', value: 'Accessories' },
                { name: '执行机构', value: 'Actuator' },
              ],
            },
          },
          {
            name: '阶跃响应',
            value: 'Step Response',
            dictData: {
              create: [
                {
                  name: '反馈连接方式',
                  value: 'Feedback Connection',
                  type: '0',
                  sort: 61,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '零功率状态',
                  value: 'Zero Power Condition',
                  type: '0',
                  sort: 62,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '行程整定参数',
                  value: 'Travel Tuning Set',
                  type: '0',
                  sort: 63,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '比例',
                  value: 'Proportional',
                  type: '1',
                  sort: 64,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '速度：',
                  value: 'Velocity',
                  type: '1',
                  sort: 65,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: 'MLF',
                  value: 'MLF',
                  type: '1',
                  sort: 66,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
            children: {
              create: [
                {
                  name: '已分析的数据',
                  value: 'Analyzed Data',
                  children: {
                    create: [
                      { name: '非性能测试', value: 'Not A Performance Test' },
                    ],
                  },
                },
                {
                  name: '组态',
                  value: 'Configuration',
                  children: {
                    create: [
                      { name: '整定', value: 'Tuning' },
                      { name: '增益', value: 'Gains' },
                      { name: '积分设置', value: 'Integral Settings' },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '阶跃响应-已分析的数据',
            value: 'Step Response-Analyzed Data',
            dictData: {
              create: [
                {
                  name: '1',
                  value: '1',
                  sort: 67,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '2',
                  value: '2',
                  sort: 68,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '3',
                  value: '3',
                  sort: 69,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '4',
                  value: '4',
                  sort: 70,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '5',
                  value: '5',
                  sort: 71,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '6',
                  value: '6',
                  sort: 72,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '7',
                  value: '7',
                  sort: 73,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '8',
                  value: '8',
                  sort: 74,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '9',
                  value: '9',
                  sort: 75,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '10',
                  value: '10',
                  sort: 76,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '11',
                  value: '11',
                  sort: 77,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
                {
                  name: '12',
                  value: '12',
                  sort: 78,
                  createBy: 'admin',
                  dictTypeId: 1,
                },
              ],
            },
            children: {
              create: [
                {
                  name: '已分析的数据(所有时间均以秒为单位)',
                  value: 'Analyzed Data (all times in seconds)',
                },
              ],
            },
          },
          {
            name: '阶跃响应-注释',
            value: 'Step Response-Notes',
            children: {
              create: [
                {
                  name: '注释',
                  value: 'Notes',
                },
              ],
            },
          },
        ],
      },
    },
  });
  // pdf层级树
  await prisma.dictDataTree.create({
    data: {
      name: 'ff',
      value: 'ff',
      children: {
        create: [
          {
            name: 'hart',
            value: 'hart',
            dictData: {
              create: [],
            },
            children: {
              create: [
                {
                  name: '仪表组态-基本',
                  value: 'Instrument Configuration-Basic',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '设备标识',
                        value: 'Device Identification',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '标签',
                              value: 'Tag',
                              dictData: {
                                create: [
                                  {
                                    name: 'HART 标签',
                                    value: 'HART Tag',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '单位',
                              value: 'Units',
                              dictData: {
                                create: [
                                  {
                                    name: '压力单位',
                                    value: 'Pressure Units',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '初始设置',
                        value: 'Initial Setup',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '控制信号',
                              value: 'Control Signal',
                              dictData: {
                                create: [
                                  {
                                    name: '控制模式',
                                    value: 'Control Mode',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '设置',
                              value: 'Setup',
                              dictData: {
                                create: [
                                  {
                                    name: '零功率状态',
                                    value: 'Zero Power Condition',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '输出',
                        value: 'Outputs',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: 'HART 变量分配',
                              value: 'HART Variable Assignments',
                              dictData: {
                                create: [
                                  {
                                    name: '主变量 (PV)',
                                    value: 'Primary Variable (PV)',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '整定',
                        value: 'Tuning',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程控制',
                              value: 'Travel Control',
                              dictData: {
                                create: [
                                  {
                                    name: '整定参数',
                                    value: 'Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '积分死区 (%)',
                                    value: 'Integral Dead Zone (%)',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力控制',
                              value: 'Pressure Control',
                              dictData: {
                                create: [
                                  {
                                    name: '整定参数',
                                    value: 'Tuning Set',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '仪表',
                        value: 'Instrument',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '仪表',
                              value: 'Instrument',
                              dictData: {
                                create: [
                                  {
                                    name: '最大供气压力',
                                    value: 'Max Supply Pressure',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '输入特性化',
                        value: 'Input Characterization',
                        dictData: {
                          create: [
                            {
                              name: '输入特性',
                              value: 'Input Characteristic',
                              sort: 6,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '行程/压力控制',
                        value: 'Travel/Pressure Control',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '控制',
                              value: 'Control',
                              dictData: {
                                create: [
                                  {
                                    name: '行程/压力选择',
                                    value: 'Travel / Pressure Select',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '限值/截止',
                              value: '限值/截止',
                              dictData: {
                                create: [
                                  {
                                    name: '低限位/截止选择',
                                    value: 'Low Limit/Cutoff Select',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '动态响应',
                              value: 'Dynamic Response',
                              dictData: {
                                create: [
                                  {
                                    name: '开阀设定点变化率（%/秒）',
                                    value: 'Set Point Rate Open (%/sec)',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力切换',
                              value: 'Pressure Fallback',
                              dictData: {
                                create: [
                                  {
                                    name: '回复',
                                    value: 'Recovery',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '阵发',
                        value: 'Burst',
                        dictData: {
                          create: [
                            {
                              name: '脉冲模式启用',
                              value: 'Burst Mode Enable',
                              sort: 8,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-报警',
                  value: 'Instrument Configuration-Alerts',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '行程历史报警',
                        value: 'Travel History Alerts',
                        dictData: {
                          create: [
                            {
                              name: '循环计数/行程累计死区 (%)',
                              value: 'Cycle Cnt/Tvl Accum Deadband (%)',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '循环计数',
                              value: 'Cycle Count',
                              dictData: {
                                create: [
                                  {
                                    name: '循环计数高报警',
                                    value: 'Cycle Count High Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程累计器',
                              value: 'Travel Accumulator',
                              dictData: {
                                create: [
                                  {
                                    name: '行程累加器高报警',
                                    value: 'Travel Accumulator High Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '行程报警',
                        value: 'Travel Alerts',
                        dictData: {
                          create: [
                            {
                              name: '所有行程死区报警 (%)',
                              value: 'Deadband for All Travel Alerts (%)',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '行程偏差',
                              value: 'Travel Deviation',
                              dictData: {
                                create: [
                                  {
                                    name: '行程偏差报警',
                                    value: 'Travel Deviation Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程高高',
                              value: 'Travel High High',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高高报警',
                                    value: 'Travel High High Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程低低',
                              value: 'Travel Low Low',
                              dictData: {
                                create: [
                                  {
                                    name: '行程低低报警',
                                    value: 'Travel Low Low Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程高',
                              value: 'Travel High',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高报警',
                                    value: 'Travel High Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程低',
                              value: 'Travel Low',
                              dictData: {
                                create: [
                                  {
                                    name: '行程低报警',
                                    value: 'Travel Low Alert',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程低限位/截止',
                              value: 'Travel Limit/Cutoff Low',
                              dictData: {
                                create: [
                                  {
                                    name: '行程限位/截止低报警',
                                    value: 'Travel Limit/Cutoff Low Alert',
                                    sort: 6,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程高限位/截止',
                              value: 'Travel Limit/Cutoff High',
                              dictData: {
                                create: [
                                  {
                                    name: '行程限位/截止高报警',
                                    value: 'Travel Limit/Cutoff High Alert',
                                    sort: 7,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '信息状态',
                        value: 'Informational Status',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '仪表时间为大概值',
                              value: 'Instrument Time is Approximate',
                              dictData: {
                                create: [
                                  {
                                    name: '仪表时间为大概值报警',
                                    value:
                                      'Instrument Time is Approximate Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '校验进行中',
                              value: 'Calibration in Progress',
                              dictData: {
                                create: [
                                  {
                                    name: '标定进行中报警',
                                    value: 'Calibration in Progress Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '自动校验进行中',
                              value: 'Autocal in Progress',
                              dictData: {
                                create: [
                                  {
                                    name: '自动标定进行中报警',
                                    value: 'Autocal in Progress Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '诊断进行中',
                              value: 'Diagnostic in Progress',
                              dictData: {
                                create: [
                                  {
                                    name: '诊断进行中报警',
                                    value: 'Diagnostic in Progress Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '诊断数据可用',
                              value: 'Diagnostic Data Available',
                              dictData: {
                                create: [
                                  {
                                    name: '诊断数据可用报警',
                                    value: 'Diagnostic Data Available Alert',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分器饱和高',
                              value: 'Integrator Saturated High',
                              dictData: {
                                create: [
                                  {
                                    name: '积分器饱和高报警',
                                    value: 'Integrator Saturated High Alert',
                                    sort: 6,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分器饱和低',
                              value: 'Integrator Saturated Low',
                              dictData: {
                                create: [
                                  {
                                    name: '积分器饱和低报警',
                                    value: 'Integrator Saturated Low Alert',
                                    sort: 7,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-报警(控制)',
                  value: 'Instrument Configuration-Alerts(cont.)',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '压力报警',
                        value: 'Pressure Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '供气压力高',
                              value: 'Supply Pressure High',
                              dictData: {
                                create: [
                                  {
                                    name: '供气压力高报警',
                                    value: 'Supply Pressure High Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '供气压力低',
                              value: 'Supply Pressure Low',
                              dictData: {
                                create: [
                                  {
                                    name: '供气压力低报警',
                                    value: 'Supply Pressure Low Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力偏差',
                              value: 'Pressure Deviation',
                              dictData: {
                                create: [
                                  {
                                    name: '压力偏差报警',
                                    value: 'Pressure Deviation Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '端口A过压',
                              value: 'Port A Overpressurized',
                              dictData: {
                                create: [
                                  {
                                    name: '端口 A 过压报警',
                                    value: 'Port A Overpressurized Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '报警记录',
                        value: 'Alert Record',
                        dictData: {
                          create: [
                            {
                              name: '仪表时钟',
                              value: 'Instrument Clock',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '报警记录非空',
                              value: 'Alert Record Not Empty',
                              dictData: {
                                create: [
                                  {
                                    name: '报警记录非空报警',
                                    value: 'Alert Record Not Empty Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '报警记录已满',
                              value: 'Alert Record Full',
                              dictData: {
                                create: [
                                  {
                                    name: '报警记录已满报警',
                                    value: 'Alert Record Full Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '电子报警',
                        value: 'Electronic Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '驱动电流',
                              value: 'Drive Current',
                              dictData: {
                                create: [
                                  {
                                    name: '驱动电流故障',
                                    value: 'Drive Current Failure',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '驱动信号',
                              value: 'Drive Signal',
                              dictData: {
                                create: [
                                  {
                                    name: '驱动信号报警',
                                    value: 'Drive Signal Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '关键 NVM',
                              value: 'Critical NVM',
                              dictData: {
                                create: [
                                  {
                                    name: '关键NVM故障',
                                    value: 'Critical NVM Failure',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '非关键 NVM',
                              value: 'Non-Critical NVM',
                              dictData: {
                                create: [
                                  {
                                    name: '非关键挥发性存储器报警',
                                    value: 'Non-Critical NVM Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '闪存完整性故障',
                              value: 'Flash Integrity Failure',
                              dictData: {
                                create: [
                                  {
                                    name: '闪存完整性故障',
                                    value: 'Flash Integrity Failure',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '参考电压故障',
                              value: 'Reference Voltage Failure',
                              dictData: {
                                create: [
                                  {
                                    name: '参考电压故障',
                                    value: 'Reference Voltage Failure',
                                    sort: 6,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '回路电流',
                              value: 'Loop Current',
                              dictData: {
                                create: [
                                  {
                                    name: '回路电流验证',
                                    value: 'Loop Current Validation',
                                    sort: 7,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '关机激活',
                              value: 'Shutdown Activated',
                              dictData: {
                                create: [
                                  {
                                    name: '关机激活报警',
                                    value: 'Shutdown Activated Alert',
                                    sort: 8,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '传感器报警',
                        value: 'Sensor Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程传感器',
                              value: 'Travel Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: '行程传感器故障',
                                    value: 'Travel Sensor Failure',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力切换激活',
                              value: 'Pressure Fallback Active',
                              dictData: {
                                create: [
                                  {
                                    name: '压力回落激活警报',
                                    value: 'Pressure Fallback Active Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '温度传感器故障',
                              value: 'Temperature Sensor Failure',
                              dictData: {
                                create: [
                                  {
                                    name: '温度传感器故障',
                                    value: 'Temperature Sensor Failure',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '小回路传感器故障',
                              value: 'Minor Loop Sensor Failure',
                              dictData: {
                                create: [
                                  {
                                    name: '小回路传感器故障',
                                    value: 'Minor Loop Sensor Failure',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-规格表',
                  value: 'Instrument Configuration-Spec Sheet',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '阀门',
                        value: 'Valve',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '内件',
                        value: 'Trim',
                        dictData: {
                          create: [
                            {
                              name: '阀座类型',
                              value: 'Seat Type',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '执行机构',
                        value: 'Actuator',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '附件',
                        value: 'Accessories',
                        dictData: {
                          create: [
                            {
                              name: '增压器',
                              value: 'Volume Booster',
                              sort: 4,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '状态监视器',
                  value: 'Status Monitor',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '监视器',
                        value: 'Monitor',
                        dictData: {
                          create: [
                            {
                              name: '输入电流',
                              value: 'Input Current',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '设备',
                        value: 'Device',
                        dictData: {
                          create: [
                            {
                              name: '信息串',
                              value: 'Message',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '报警',
                        value: 'Alerts',
                        dictData: {
                          create: [
                            {
                              name: '行程高',
                              value: 'Travel High',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '供气压力性能诊断',
                  value: 'Supply Pressure Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '供气压力性能诊断',
                        value: 'Supply Pressure Performance Diagnostic',
                        sort: 6,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: '行程偏差性能诊断',
                  value: 'Travel Deviation Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '行程偏差性能诊断',
                        value: 'Travel Deviation Performance Diagnostic',
                        sort: 7,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: 'I/P和放大器完整性性能诊断',
                  value: 'I/P and Relay Integrity Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: 'I/P和放大器完整性性能诊断',
                        value: 'I/P and Relay Integrity Performance Diagnostic',
                        sort: 8,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: '放大器调整性能诊断',
                  value: 'Relay Adjustment Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '放大器调整性能诊断',
                        value: 'Relay Adjustment Performance Diagnostic',
                        sort: 9,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: '空气质量流量性能诊断',
                  value: 'Air Mass Flow Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '空气质量流量性能诊断',
                        value: 'Air Mass Flow Performance Diagnostic',
                        sort: 10,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: '阀门摩擦力性能诊断',
                  value: 'Valve Friction Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '阀门摩擦力性能诊断',
                        value: 'Valve Friction Performance Diagnostic',
                        sort: 11,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
                {
                  name: '完全扫描',
                  value: 'Total Scan',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '输入',
                        value: 'Inputs',
                        dictData: {
                          create: [
                            {
                              name: '输入开始',
                              value: 'Input Start',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '已分析的数据',
                        value: 'Analyzed Data',
                        dictData: {
                          create: [
                            {
                              name: '平均动态误差',
                              value: 'Avg. Dynamic Error',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '组态',
                        value: 'Configuration',
                        dictData: {
                          create: [
                            {
                              name: '反馈连接方式',
                              value: 'Feedback Connection',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '整定',
                              value: 'Tuning',
                              dictData: {
                                create: [
                                  {
                                    name: '行程整定参数',
                                    value: 'Travel Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '增益',
                              value: 'Gains',
                              dictData: {
                                create: [
                                  {
                                    name: '比例',
                                    value: 'Proportional',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '积分控制',
                                    value: 'Integral Control',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描-特性曲线分析器设置',
                  value: 'Total Scan-Signature Analyzer Settings',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '特性曲线分析器设置',
                        value: 'Signature Analyzer Settings',
                        dictData: {
                          create: [
                            {
                              name: '分析',
                              value: 'Analysis',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描-注释',
                  value: 'Total Scan-Notes',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '注释',
                        value: 'Notes',
                        dictData: {
                          create: [
                            {
                              name: '注释',
                              value: 'Notes',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描-规格表',
                  value: 'Total Scan-Spec Sheet',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '阀门',
                        value: 'Valve',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '内件',
                        value: 'Trim',
                        dictData: {
                          create: [
                            {
                              name: '阀座类型',
                              value: 'Seat Type',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '附件',
                        value: 'Accessories',
                        dictData: {
                          create: [
                            {
                              name: '增压器',
                              value: 'Volume Booster',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '执行机构',
                        value: 'Actuator',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 4,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应',
                  value: 'Step Response',
                  dictData: {
                    create: [
                      {
                        name: '测试设置',
                        value: 'Test Set',
                        sort: 16,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [
                      {
                        name: '已分析的数据',
                        value: 'Analyzed Data',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '非性能测试',
                              value: 'Not A Performance Test',
                              dictData: {
                                create: [],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '组态',
                        value: 'Configuration',
                        dictData: {
                          create: [
                            {
                              name: '反馈连接方式',
                              value: 'Feedback Connection',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '整定',
                              value: 'Tuning',
                              dictData: {
                                create: [
                                  {
                                    name: '行程整定参数',
                                    value: 'Travel Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '增益',
                              value: 'Gains',
                              dictData: {
                                create: [
                                  {
                                    name: '比例',
                                    value: 'Proportional',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '积分控制',
                                    value: 'Integral Control',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应-已分析的数据',
                  value: 'Step Response-Analyzed Data',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '已分析的数据(所有时间均以秒为单位)',
                        value: 'Analyzed Data (all times in seconds)',
                        dictData: {
                          create: [
                            {
                              name: '1',
                              value: '1',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应-注释',
                  value: 'Step Response-Notes',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '注释',
                        value: 'Notes',
                        dictData: {
                          create: [
                            {
                              name: '注释',
                              value: 'Notes',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'ff',
            value: 'ff',
            dictData: {
              create: [],
            },
            children: {
              create: [
                {
                  name: '仪表组态-基本，转换块',
                  value: 'Instrument Configuration-Basic, Transducer',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '初始设置',
                        value: 'Initial Setup',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '转换块模式',
                              value: 'Transducer Block Mode',
                              dictData: {
                                create: [
                                  {
                                    name: '正常',
                                    value: 'Normal',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '设置',
                              value: 'Setup',
                              dictData: {
                                create: [
                                  {
                                    name: '行程/压力选择',
                                    value: 'Travel/Pressure Select',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '整定',
                        value: 'Tuning',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程控制',
                              value: 'Travel Control',
                              dictData: {
                                create: [
                                  {
                                    name: '整定参数',
                                    value: 'Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '行程死区',
                                    value: 'Travel Dead Zone',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力控制',
                              value: 'Pressure Control',
                              dictData: {
                                create: [
                                  {
                                    name: '整定参数',
                                    value: 'Tuning Set',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '行程/压力控制',
                        value: 'Travel/Pressure Control',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '控制',
                              value: 'Control',
                              dictData: {
                                create: [
                                  {
                                    name: '行程/压力选择',
                                    value: 'Travel/Pressure Select',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '截止',
                              value: 'Cutoff',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高截止点',
                                    value: 'Travel Cutoff High',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '输入特性化',
                        value: 'Input Characterization',
                        dictData: {
                          create: [
                            {
                              name: '输入特性',
                              value: 'Input Characteristic',
                              sort: 4,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-报警，转换块',
                  value: 'Instrument Configuration-Alerts, Transducer',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '电子部件报警',
                        value: 'Electronics Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '驱动电流',
                              value: 'Drive Current',
                              dictData: {
                                create: [
                                  {
                                    name: '驱动电流报警',
                                    value: 'Drive Current Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '驱动信号',
                              value: 'Drive Signal',
                              dictData: {
                                create: [
                                  {
                                    name: '驱动信号报警',
                                    value: 'Drive Signal Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '处理器损坏',
                              value: 'Processor Impaired',
                              dictData: {
                                create: [
                                  {
                                    name: '程序存储器报警',
                                    value: 'Program Memory Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '接近报警',
                        value: 'Proximity Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程开',
                              value: 'Travel Open',
                              dictData: {
                                create: [
                                  {
                                    name: '行程打开报警',
                                    value: 'Travel Open Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程关',
                              value: 'Travel Closed',
                              dictData: {
                                create: [
                                  {
                                    name: '行程关闭报警',
                                    value: 'Travel Closed Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '近接式',
                              value: 'Proximity',
                              dictData: {
                                create: [
                                  {
                                    name: '接近高高报警',
                                    value: 'Proximity High High Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '组态报警',
                        value: 'Config Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '输出块超时',
                              value: 'Output Block Timeout',
                              dictData: {
                                create: [
                                  {
                                    name: '输出块超时',
                                    value: 'Output Block Timeout',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '功能块设置为默认值',
                              value: 'Blocks Set to Defaults',
                              dictData: {
                                create: [
                                  {
                                    name: '功能块设置为默认值',
                                    value: 'Blocks Set to Defaults',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '关机报警',
                              value: 'Shutdown Alert',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警启用',
                                    value: 'PlantWeb Alert Enable',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '报警键',
                              value: 'Alert Key',
                              dictData: {
                                create: [
                                  {
                                    name: '报警键',
                                    value: 'Alert Key',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '压力/温度报警',
                        value: 'Pressure/Temperature Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '供气压力',
                              value: 'Supply Pressure',
                              dictData: {
                                create: [
                                  {
                                    name: '供气压力高报警',
                                    value: 'Supply Pressure High Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '温度限值',
                              value: 'Temperature Limit',
                              dictData: {
                                create: [
                                  {
                                    name: '温度高报警',
                                    value: 'Temperature High Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '性能报警',
                        value: 'Performance Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '性能诊断',
                              value: 'Performance Diagnostic',
                              dictData: {
                                create: [
                                  {
                                    name: '运行性能诊断',
                                    value: 'PD Run',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '性能临界',
                              value: 'Performance Critical',
                              dictData: {
                                create: [
                                  {
                                    name: '性能临界报警',
                                    value: 'Performance Critical Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '性能降低',
                              value: 'Performance Reduced',
                              dictData: {
                                create: [
                                  {
                                    name: '性能降低报警',
                                    value: 'Performance Reduced Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '性能信息',
                              value: 'Performance Information',
                              dictData: {
                                create: [
                                  {
                                    name: '性能信息报警',
                                    value: 'Performance Information Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '模拟 PWA',
                        value: 'Simulate PWA',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '模拟状态',
                              value: 'Simulation Status',
                              dictData: {
                                create: [
                                  {
                                    name: '模拟 PWA 状态',
                                    value: 'Simulate PWA Status',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '组态报警',
                              value: 'Config Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '功能块设置为默认值',
                                    value: 'Blocks Set to Defaults',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '电子部件报警',
                              value: 'Electronics Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '驱动电流',
                                    value: 'Drive Current',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力/温度报警',
                              value: 'Pressure/Temperature Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '供气压力',
                                    value: 'Supply Pressure',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '性能报警',
                              value: 'Performance Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '性能临界',
                                    value: 'Performance Critical',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '传感器报警',
                              value: 'Sensor Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '输出压力传感器',
                                    value: 'Output Pressure Sensor',
                                    sort: 6,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程报警',
                              value: 'Travel Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '行程偏差',
                                    value: 'Travel Deviation',
                                    sort: 7,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程历史报警',
                              value: 'Travel History Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '循环计数高',
                                    value: 'Cycle Count High',
                                    sort: 8,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-报警，转换块(控制)',
                  value: 'Instrument Configuration-Alerts, Transducer(cont.)',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '行程报警',
                        value: 'Travel Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程偏差',
                              value: 'Travel Deviation',
                              dictData: {
                                create: [
                                  {
                                    name: '行程偏差报警',
                                    value: 'Travel Deviation Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程限位',
                              value: 'Travel Limit',
                              dictData: {
                                create: [
                                  {
                                    name: '行程限位高高报警',
                                    value: 'Travel Limit High High Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程高限位',
                              value: 'Travel Limit High',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高限位',
                                    value: 'Travel Limit High',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程低限位',
                              value: 'Travel Limit Low',
                              dictData: {
                                create: [
                                  {
                                    name: '行程低限位',
                                    value: 'Travel Limit Low',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '传感器报警',
                        value: 'Sensor Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程传感器',
                              value: 'Travel Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: '行程传感器报警',
                                    value: 'Travel Sensor Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '输出压力传感器',
                              value: 'Output Pressure Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: '端口 A 压力传感器报警',
                                    value: 'Port A Pressure Sensor Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '供气压力传感器',
                              value: 'Supply Pressure Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: '供气压力传感器报警',
                                    value: 'Supply Pressure Sensor Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '温度传感器',
                              value: 'Temperature Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: '温度传感器报警',
                                    value: 'Temperature Sensor Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力切换激活',
                              value: 'Pressure Fallback Active',
                              dictData: {
                                create: [
                                  {
                                    name: '压力回落激活警报',
                                    value: 'Pressure Fallback Active Alert',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '行程历史报警',
                        value: 'Travel History Alerts',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '循环计数高',
                              value: 'Cycle Count High',
                              dictData: {
                                create: [
                                  {
                                    name: '循环计数高报警',
                                    value: 'Cycle Count High Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程累计器',
                              value: 'Travel Accumulator',
                              dictData: {
                                create: [
                                  {
                                    name: '行程累加器高报警',
                                    value: 'Travel Accumulator High Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-规格表，转换块',
                  value: 'Instrument Configuration-Spec Sheet, Transducer',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '仪表',
                        value: 'Instrument',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '单位',
                              value: 'Units',
                              dictData: {
                                create: [
                                  {
                                    name: '压力单位',
                                    value: 'Pressure Units',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '仪表',
                              value: 'Instrument',
                              dictData: {
                                create: [
                                  {
                                    name: '最大供气压力',
                                    value: 'Max Supply Pressure',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '标定',
                              value: 'Calibration',
                              dictData: {
                                create: [
                                  {
                                    name: '人员',
                                    value: 'Person',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '标定数据',
                              value: 'Calibration Data',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高标定',
                                    value: 'Travel High Cal',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: 'MAI 通道',
                        value: 'MAI Channels',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: 'MAI 通道',
                              value: 'MAI Channels',
                              dictData: {
                                create: [
                                  {
                                    name: '通道 1',
                                    value: 'Channel 1',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '阀门',
                        value: 'Valve',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '内件',
                        value: 'Trim',
                        dictData: {
                          create: [
                            {
                              name: '阀座类型',
                              value: 'Seat Type',
                              sort: 4,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '其他直通式流量特性选项',
                              value: 'Extra Sliding Stem Valve Trim Options',
                              dictData: {
                                create: [],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '执行机构',
                        value: 'Actuator',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 5,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '参考',
                        value: 'Reference',
                        dictData: {
                          create: [
                            {
                              name: '开阀动作时间',
                              value: 'Stroking Time Open',
                              sort: 6,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '仪表组态-资源块',
                  value: 'Instrument Configuration-Resource Block',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '模式',
                        value: 'Mode',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '资源块模式',
                              value: 'Resource Block Mode',
                              dictData: {
                                create: [
                                  {
                                    name: '正常',
                                    value: 'Normal',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '写锁定',
                        value: 'Write Lock',
                        dictData: {
                          create: [
                            {
                              name: '写锁定',
                              value: 'Write Lock',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '通讯超时',
                        value: 'Comm Timeout',
                        dictData: {
                          create: [
                            {
                              name: 'RCas 超时',
                              value: 'RCas Timeout',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '选项',
                        value: 'Options',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '功能选择',
                              value: 'Feature Select',
                              dictData: {
                                create: [
                                  {
                                    name: '支持报告',
                                    value: 'Reports Supported',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '警报处理',
                        value: 'Alarm Handling',
                        dictData: {
                          create: [
                            {
                              name: '报警键',
                              value: 'Alert Key',
                              sort: 5,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '全部警报',
                              value: 'All Alarms',
                              dictData: {
                                create: [
                                  {
                                    name: '确认时间',
                                    value: 'Confirm Time',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '块警报',
                              value: 'Block Alarm',
                              dictData: {
                                create: [
                                  {
                                    name: '已禁用',
                                    value: 'Disabled',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '写入警报',
                              value: 'Write Alarm',
                              dictData: {
                                create: [
                                  {
                                    name: '已禁用',
                                    value: 'Disabled',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '仪表',
                        value: 'Instrument',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '仪表描述',
                              value: 'Instrument Description',
                              dictData: {
                                create: [
                                  {
                                    name: '策略',
                                    value: 'Strategy',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '状态监视器',
                  value: 'Status Monitor',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '监视器',
                        value: 'Monitor',
                        dictData: {
                          create: [
                            {
                              name: '设定点 (SP)',
                              value: 'Setpoint',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '仪表',
                        value: 'Instrument',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '转换块',
                              value: 'TRANSDUCER',
                              dictData: {
                                create: [
                                  {
                                    name: '仪表系列',
                                    value: 'Instrument Family',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '资源块',
                              value: 'RESOURCE',
                              dictData: {
                                create: [
                                  {
                                    name: '标签描述',
                                    value: 'Tag Description',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '块状态',
                        value: 'Block Status',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '转换块',
                              value: 'TRANSDUCER',
                              dictData: {
                                create: [
                                  {
                                    name: '模拟生效',
                                    value: 'Simulate Active',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '资源块',
                              value: 'RESOURCE',
                              dictData: {
                                create: [
                                  {
                                    name: '设备状态',
                                    value: 'Device State',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '组态',
                        value: 'Config',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '输出块超时',
                              value: 'Output Block Timeout',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '功能块设置为默认值',
                              value: 'Blocks Set to Defaults',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '关机报警',
                              value: 'Shutdown Alert',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警 ',
                                    value: 'PlantWeb Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '压力/温度',
                        value: 'Pressure/Temperature',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '供气压力',
                              value: 'Supply Pressure',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '温度限值',
                              value: 'Temperature Limit',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '传感器',
                        value: 'Sensor',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程传感器',
                              value: 'Travel Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '输出压力传感器',
                              value: 'Output Pressure Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '供气压力传感器',
                              value: 'Supply Pressure Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '温度传感器',
                              value: 'Temperature Sensor',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '压力切换激活',
                              value: 'Pressure Fallback Active',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 5,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '电子部件',
                        value: 'Electronic',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '驱动电流',
                              value: 'Drive Current',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '驱动信号',
                              value: 'Drive Signal',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '处理器损坏',
                              value: 'Processor Impaired',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '近接式',
                        value: 'Proximity',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '接近报警',
                              value: 'Proximity Alerts',
                              dictData: {
                                create: [
                                  {
                                    name: '行程开',
                                    value: 'Travel Open',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '行程',
                        value: 'Travel',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程偏差',
                              value: 'Travel Deviation',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程限位',
                              value: 'Travel Limit',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程高限位',
                              value: 'Travel Limit High',
                              dictData: {
                                create: [
                                  {
                                    name: '行程高限位',
                                    value: 'Travel Limit High',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '行程低限位',
                              value: 'Travel Limit Low',
                              dictData: {
                                create: [
                                  {
                                    name: '行程低限位',
                                    value: 'Travel Limit Low',
                                    sort: 4,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '行程历史记录',
                        value: 'Travel History',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '行程累计高',
                              value: 'Travel Accumulator High',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '循环计数高',
                              value: 'Cycle Count High',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '临界性能',
                        value: 'Perf Critical',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '性能临界',
                              value: 'Performance Critical',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '可能原因',
                              value: 'Possible Cause',
                              dictData: {
                                create: [
                                  {
                                    name: 'I/P',
                                    value: 'I/P',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '性能信息',
                        value: 'Perf Info',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '性能信息',
                              value: 'Performance Information',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '可能原因',
                              value: 'Possible Cause',
                              dictData: {
                                create: [
                                  {
                                    name: 'PDInside 未运行',
                                    value: 'PDInside Not Running',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '其他信息',
                              value: 'Other Information',
                              dictData: {
                                create: [
                                  {
                                    name: 'PDInside 未运行',
                                    value: 'PDInside Not Running',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '降低性能',
                        value: 'Perf Reduced',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '性能降低',
                              value: 'Performance Reduced',
                              dictData: {
                                create: [
                                  {
                                    name: 'PlantWeb 报警',
                                    value: 'PlantWeb Alert',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '可能原因',
                              value: 'Possible Cause',
                              dictData: {
                                create: [
                                  {
                                    name: 'I/P',
                                    value: 'I/P',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应',
                  value: 'Step Response',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '已分析的数据',
                        value: 'Analyzed Data',
                        dictData: {
                          create: [],
                        },
                        children: {
                          create: [
                            {
                              name: '非性能测试',
                              value: 'Not A Performance Test',
                              dictData: {
                                create: [],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                      {
                        name: '组态',
                        value: 'Configuration',
                        dictData: {
                          create: [
                            {
                              name: '反馈连接方式',
                              value: 'Feedback Connection',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '整定',
                              value: 'Tuning',
                              dictData: {
                                create: [
                                  {
                                    name: '行程整定参数',
                                    value: 'Travel Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '增益',
                              value: 'Gains',
                              dictData: {
                                create: [
                                  {
                                    name: '比例',
                                    value: 'Proportional',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '积分控制',
                                    value: 'Integral Control',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应-已分析的数据',
                  value: 'Step Response-Analyzed Data',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '已分析的数据(所有时间均以秒为单位)',
                        value: 'Analyzed Data (all times in seconds)',
                        dictData: {
                          create: [
                            {
                              name: '1',
                              value: '1',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阶跃响应-注释',
                  value: 'Step Response-Notes',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '注释',
                        value: 'Notes',
                        dictData: {
                          create: [
                            {
                              name: '注释',
                              value: 'Notes',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描',
                  value: 'Total Scan',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '输入',
                        value: 'Inputs',
                        dictData: {
                          create: [
                            {
                              name: '输入开始',
                              value: 'Input Start',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '已分析的数据',
                        value: 'Analyzed Data',
                        dictData: {
                          create: [
                            {
                              name: '平均动态误差',
                              value: 'Avg. Dynamic Error',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '组态',
                        value: 'Configuration',
                        dictData: {
                          create: [
                            {
                              name: '反馈连接方式',
                              value: 'Feedback Connection',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [
                            {
                              name: '整定',
                              value: 'Tuning',
                              dictData: {
                                create: [
                                  {
                                    name: '行程整定参数',
                                    value: 'Travel Tuning Set',
                                    sort: 1,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '增益',
                              value: 'Gains',
                              dictData: {
                                create: [
                                  {
                                    name: '比例',
                                    value: 'Proportional',
                                    sort: 2,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                            {
                              name: '积分设置',
                              value: 'Integral Settings',
                              dictData: {
                                create: [
                                  {
                                    name: '积分控制',
                                    value: 'Integral Control',
                                    sort: 3,
                                    type: '0',
                                    createBy: 'admin',
                                    dictTypeId: 4,
                                  },
                                ],
                              },
                              children: {
                                create: [],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描-注释',
                  value: 'Total Scan-Notes',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '注释',
                        value: 'Notes',
                        dictData: {
                          create: [
                            {
                              name: '注释',
                              value: 'Notes',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '完全扫描-规格表',
                  value: 'Total Scan-Spec Sheet',
                  dictData: {
                    create: [],
                  },
                  children: {
                    create: [
                      {
                        name: '阀门',
                        value: 'Valve',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 1,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '内件',
                        value: 'Trim',
                        dictData: {
                          create: [
                            {
                              name: '阀座类型',
                              value: 'Seat Type',
                              sort: 2,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                      {
                        name: '执行机构',
                        value: 'Actuator',
                        dictData: {
                          create: [
                            {
                              name: '制造商',
                              value: 'Manufacturer',
                              sort: 3,
                              type: '0',
                              createBy: 'admin',
                              dictTypeId: 4,
                            },
                          ],
                        },
                        children: {
                          create: [],
                        },
                      },
                    ],
                  },
                },
                {
                  name: '阀门摩擦力性能诊断',
                  value: 'Valve Friction Performance Diagnostic',
                  dictData: {
                    create: [
                      {
                        name: '阀门摩擦力性能诊断',
                        value: 'Valve Friction Performance Diagnostic',
                        sort: 13,
                        type: '0',
                        createBy: 'admin',
                        dictTypeId: 4,
                      },
                    ],
                  },
                  children: {
                    create: [],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
  // create factory
  await prisma.factory.create({
    data: {
      name: '万华化学（福建）有限公司',
      address: '福建省福州市福清市江阴镇江阴港城经济区国盛大道3号',
      createBy: 'admin',
      device: {
        create: [
          { name: 'PVC', createBy: 'admin' },
          { name: 'VCM', createBy: 'admin' },
        ],
      },
    },
  });
  await prisma.factory.createMany({
    data: [
      {
        name: '英威达尼龙化工（中国）有限公司',
        address: '上海化学工业区天华路88号',
        createBy: 'admin',
      },
      {
        name: '九江心连心化肥有限公司',
        address: '江西省九江市彭泽县矶山工业园区',
        createBy: 'admin',
      },
      {
        name: '新浦化学（泰兴）有限公司',
        address: '江苏省泰兴经济开发区疏港路１号',
        createBy: 'admin',
      },
      {
        name: '镇江联成化学工业有限公司',
        address: '江苏省镇江新区临江西路57号',
        createBy: 'admin',
      },
      {
        name: '泰州联成化学工业有限公司',
        address: '江苏省泰兴市滨江镇新木路9号',
        createBy: 'admin',
      },
      {
        name: '扬子石化-巴斯夫有限责任公司',
        address: '江苏省南京市六合区乙烯路266号',
        createBy: 'admin',
      },
    ],
  });
  await prisma.rule.createMany({
    data: [
      {
        name: 'hart online',
        url: 'http://200.200.200.18:9000/rule/1724032676037-HART_Online.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2xxSbNXQ3ayClsBEH1hZ%2F20240819%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240819T015756Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e007536b7cbc5d0c21d086216909621a77334b523bd2c6eb96bab046d11ef971',
        fileName: '1724032676037-HART_Online.xlsx',
      },
    ],
  });

  console.log('注入数据成功');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
