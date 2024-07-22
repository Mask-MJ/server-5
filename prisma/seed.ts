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
  // create dept
  await prisma.dept.create({
    data: {
      name: '中国集团',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '北京分公司',
            createBy: 'admin',
            children: {
              create: [
                { name: '技术部', createBy: 'admin' },
                { name: '销售部', createBy: 'admin' },
                { name: '会计部', createBy: 'admin' },
              ],
            },
          },
          {
            name: '上海分公司',
            createBy: 'admin',
            children: {
              create: [
                { name: '技术部', createBy: 'admin' },
                { name: '销售部', createBy: 'admin' },
              ],
            },
          },
          {
            name: '广州分公司',
            createBy: 'admin',
            children: {
              create: [
                { name: '技术部', createBy: 'admin' },
                { name: '销售部', createBy: 'admin' },
              ],
            },
          },
          {
            name: '深圳分公司',
            createBy: 'admin',
            children: {
              create: [
                { name: '技术部', createBy: 'admin' },
                { name: '销售部', createBy: 'admin' },
              ],
            },
          },
        ],
      },
    },
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
      createBy: 'admin',
      children: {
        create: [
          {
            name: '工作台',
            icon: 'i-ant-design:laptop-outlined',
            sort: 1,
            path: '/dashboard/workTable',
            createBy: 'admin',
          },
        ],
      },
    },
  });
  // 业务功能
  await prisma.menu.create({
    data: {
      name: '业务功能',
      icon: 'i-ant-design:apartment-outlined',
      sort: 2,
      path: '/project',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '工厂管理',
            icon: 'i-ant-design:cluster-outlined',
            sort: 1,
            path: '/project/factory',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:factory:create' },
                { name: '查询', value: 'project:factory:query' },
                { name: '修改', value: 'project:factory:update' },
                { name: '删除', value: 'project:factory:delete' },
              ],
            },
          },
          {
            name: '装置管理',
            icon: 'i-ant-design:deployment-unit-outlined',
            sort: 2,
            path: '/project/device',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:device:create' },
                { name: '查询', value: 'project:device:query' },
                { name: '修改', value: 'project:device:update' },
                { name: '删除', value: 'project:device:delete' },
              ],
            },
          },
          {
            name: '装置列表',
            icon: 'i-ant-design:deployment-unit-outlined',
            sort: 3,
            hidden: true,
            path: '/project/device/:id',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:device:create' },
                { name: '查询', value: 'project:device:query' },
                { name: '修改', value: 'project:device:update' },
                { name: '删除', value: 'project:device:delete' },
              ],
            },
          },
          {
            name: '阀门管理',
            icon: 'i-ant-design:dashboard-outlined',
            sort: 4,
            path: '/project/valve',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:valve:create' },
                { name: '查询', value: 'project:valve:query' },
                { name: '修改', value: 'project:valve:update' },
                { name: '删除', value: 'project:valve:delete' },
              ],
            },
          },
          {
            name: '阀门列表',
            icon: 'i-ant-design:dashboard-outlined',
            sort: 5,
            hidden: true,
            path: '/project/valve/:id',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:valve:create' },
                { name: '查询', value: 'project:valve:query' },
                { name: '修改', value: 'project:valve:update' },
                { name: '删除', value: 'project:valve:delete' },
              ],
            },
          },
          {
            name: '项目管理',
            icon: 'i-ant-design:cloud-server-outlined',
            sort: 6,
            path: '/project/contract',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:contract:create' },
                { name: '查询', value: 'project:contract:query' },
                { name: '修改', value: 'project:contract:update' },
                { name: '删除', value: 'project:contract:delete' },
              ],
            },
          },
          {
            name: '项目列表',
            icon: 'i-ant-design:cloud-server-outlined',
            sort: 7,
            hidden: true,
            path: '/project/contract/:id',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:contract:create' },
                { name: '查询', value: 'project:contract:query' },
                { name: '修改', value: 'project:contract:update' },
                { name: '删除', value: 'project:contract:delete' },
              ],
            },
          },
          {
            name: '分析任务',
            icon: 'i-ant-design:line-chart-outlined',
            sort: 8,
            path: '/project/analysisTask',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:analysisTask:create' },
                { name: '查询', value: 'project:analysisTask:query' },
                { name: '修改', value: 'project:analysisTask:update' },
                { name: '删除', value: 'project:analysisTask:delete' },
              ],
            },
          },
          {
            name: '任务列表',
            icon: 'i-ant-design:line-chart-outlined',
            sort: 9,
            path: '/project/analysisTask/:id',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'project:analysisTask:create' },
                { name: '查询', value: 'project:analysisTask:query' },
                { name: '修改', value: 'project:analysisTask:update' },
                { name: '删除', value: 'project:analysisTask:delete' },
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
      createBy: 'admin',
      children: {
        create: [
          {
            name: '用户管理',
            icon: 'i-ant-design:user-outlined',
            sort: 1,
            path: '/system/user',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:user:create' },
                { name: '查询', value: 'system:user:query' },
                { name: '修改', value: 'system:user:update' },
                { name: '删除', value: 'system:user:delete' },
              ],
            },
          },
          {
            name: '角色管理',
            icon: 'i-ant-design:usergroup-add-outlined',
            sort: 2,
            path: '/system/role',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:role:create' },
                { name: '查询', value: 'system:role:query' },
                { name: '修改', value: 'system:role:update' },
                { name: '删除', value: 'system:role:delete' },
              ],
            },
          },
          {
            name: '菜单管理',
            icon: 'i-ant-design:menu-outlined',
            sort: 3,
            path: '/system/menu',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:menu:create' },
                { name: '查询', value: 'system:menu:query' },
                { name: '修改', value: 'system:menu:update' },
                { name: '删除', value: 'system:menu:delete' },
              ],
            },
          },
          {
            name: '模板管理',
            icon: 'i-ant-design:medicine-box-outlined',
            sort: 4,
            path: '/system/dictType',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:dictType:create' },
                { name: '查询', value: 'system:dictType:query' },
                { name: '修改', value: 'system:dictType:update' },
                { name: '删除', value: 'system:dictType:delete' },
              ],
            },
          },
          {
            name: '关键字管理',
            icon: 'i-ant-design:medicine-box-outlined',
            sort: 5,
            path: '/system/dictData/:id',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:dictData:create' },
                { name: '查询', value: 'system:dictData:query' },
                { name: '修改', value: 'system:dictData:update' },
                { name: '删除', value: 'system:dictData:delete' },
              ],
            },
          },
          {
            name: '部门管理',
            icon: 'i-ant-design:gold-twotone',
            sort: 6,
            path: '/system/dept',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:dept:create' },
                { name: '查询', value: 'system:dept:query' },
                { name: '修改', value: 'system:dept:update' },
                { name: '删除', value: 'system:dept:delete' },
              ],
            },
          },
          {
            name: '岗位管理',
            icon: 'i-ant-design:golden-filled',
            sort: 7,
            path: '/system/post',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:post:create' },
                { name: '查询', value: 'system:post:query' },
                { name: '修改', value: 'system:post:update' },
                { name: '删除', value: 'system:post:delete' },
              ],
            },
          },
          {
            name: '规则管理',
            icon: 'i-ant-design:schedule-outlined',
            sort: 8,
            path: '/system/rule',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:rule:create' },
                { name: '查询', value: 'system:rule:query' },
                { name: '修改', value: 'system:rule:update' },
                { name: '删除', value: 'system:rule:delete' },
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
      path: '/monitor',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '在线用户',
            icon: 'i-ant-design:aim-outlined',
            sort: 1,
            path: '/monitor/online',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [
                { name: '查询', value: 'monitor:online:query' },
                { name: '强退', value: 'monitor:online:forceLogout' },
              ],
            },
          },
          {
            name: '登录日志',
            sort: 2,
            icon: 'i-ant-design:contacts-outlined',
            path: '/monitor/loginLog',
            createBy: 'admin',
            permission: {
              create: [{ name: '查询', value: 'monitor:loginLog:query' }],
            },
          },
          {
            name: '操作日志',
            sort: 3,
            icon: 'i-ant-design:cloud-server-outlined',
            path: '/monitor/operationLog',
            createBy: 'admin',
            permission: {
              create: [{ name: '查询', value: 'monitor:operationLog:query' }],
            },
          },
          {
            name: '服务器监控',
            icon: 'i-ant-design:fund-projection-screen-outlined',
            sort: 4,
            path: '/monitor/info',
            hidden: true,
            createBy: 'admin',
            permission: {
              create: [{ name: '查询', value: 'monitor:info:query' }],
            },
          },
        ],
      },
    },
  });
  /// create dictType
  await prisma.dictType.create({
    data: {
      name: 'ffonline英文版',
      value: 'ff online',
      createBy: 'admin',
      dictData: {
        create: [
          { name: '阀门位号', value: 'name', createBy: 'admin' },
          { name: '阀门型号', value: 'model', createBy: 'admin' },
          { name: '阀门品牌', value: 'brand', createBy: 'admin' },
        ],
      },
    },
  });
  await prisma.dictType.create({
    data: {
      name: 'ffonline中文版',
      value: 'ff online',
      createBy: 'admin',
      dictData: {
        create: [
          { name: '阀门位号-中文版', value: 'name', createBy: 'admin' },
          { name: '阀门型号-中文版', value: 'model', createBy: 'admin' },
          { name: '阀门品牌-中文版', value: 'brand', createBy: 'admin' },
        ],
      },
    },
  });
  await prisma.dictType.create({
    data: {
      name: 'hard',
      value: 'hard',
      createBy: 'admin',
      dictData: {
        create: [
          {
            name: 'HATR 标签',
            value: 'HART Tag',
            createBy: 'admin',
            remark: 'Hart|仪表组态-基本|设备标识|标签',
          },
          {
            name: '行程',
            value: 'Travel',
            createBy: 'admin',
            remark: 'hart|状态监视器|监视器',
          },
          {
            name: '循环计数',
            value: 'Cycle Count',
            createBy: 'admin',
            remark: 'hart|状态监视器|监视器',
          },
          {
            name: '行程偏差',
            value: 'Travel Deviation',
            createBy: 'admin',
            remark: 'hart|状态监视器|监视器',
          },
          {
            name: '平均动态误差',
            value: 'Avg. Dynamic Error',
            createBy: 'admin',
            remark: 'hart|完全扫描|已分析的数据',
          },
          {
            name: '平均扭矩',
            value: 'Average Torque',
            createBy: 'admin',
            remark: 'hart|完全扫描|已分析的数据',
          },
          {
            name: '额定行程',
            value: 'Rated Travel',
            createBy: 'admin',
            remark: 'hart|完全扫描|阀门',
          },
          {
            name: '反馈连接方式',
            value: 'Feedback Connection',
            createBy: 'admin',
            remark: 'hart|阶跃响应|组态',
          },
          {
            name: '行程高',
            value: 'Travel High',
            createBy: 'admin',
            remark: 'hart|状态监视器|报警',
          },
        ],
      },
    },
  });
  // create factory
  await prisma.factory.create({
    data: {
      name: '北京总工厂',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '北京分厂',
            createBy: 'admin',
            device: {
              create: [
                {
                  name: '北京分厂-装置1',
                  createBy: 'admin',
                  valve: {
                    create: [
                      {
                        tag: 'DW-R1',
                        createBy: 'admin',
                        factoryId: 2,
                      },
                      {
                        tag: 'DW-R2',
                        createBy: 'admin',
                        factoryId: 2,
                      },
                    ],
                  },
                },
                {
                  name: '北京分厂-装置2',
                  createBy: 'admin',
                },
              ],
            },
          },
          {
            name: '北京分厂2',
            createBy: 'admin',
            device: {
              create: [
                { name: '北京分厂2-装置1', createBy: 'admin' },
                { name: '北京分厂2-装置2', createBy: 'admin' },
              ],
            },
          },
        ],
      },
    },
  });
  await prisma.factory.create({
    data: {
      name: '上海总工厂',
      createBy: 'admin',
      children: {
        create: [
          { name: '上海分厂', createBy: 'admin' },
          { name: '上海分厂2', createBy: 'admin' },
        ],
      },
    },
  });
  await prisma.factory.create({
    data: {
      name: '深圳总工厂',
      createBy: 'admin',
      children: {
        create: [
          { name: '深圳分厂', createBy: 'admin' },
          { name: '深圳分厂2', createBy: 'admin' },
        ],
      },
    },
  });

  await prisma.analysisTask.create({
    data: {
      name: '分析任务1-hard',
      createBy: 'admin',
      dictTypeId: 3,
      factoryId: 1,
      ruleId: 1,
      pdf: {
        create: [
          {
            name: '1721111667600-FV101_3_20240307_1437_REPORT 中文.pdf',
            url: 'http://200.200.200.18:9000/pdf/1721111667600-FV101_3_20240307_1437_REPORT%20%E4%B8%AD%E6%96%87.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2xxSbNXQ3ayClsBEH1hZ%2F20240716%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240716T063427Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=78f813a62c350669d24f2fde35210e49a00eb96f5a56412f019c5a1c54e28f3a',
            createBy: 'admin',
          },
        ],
      },
    },
  });
  await prisma.rule.createMany({
    data: [
      {
        name: 'Emily Test 0715',
        url: 'http://200.200.200.18:9000/rule/1721017853349-HART_Online%281%29.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2xxSbNXQ3ayClsBEH1hZ%2F20240715%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240715T043053Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=9e2058516768e0b1a37f900ca20a3fa0b28dcf0783c7463c94124dd1e2f49bc1',
        fileName: '1721017853349-HART_Online(1).xlsx',
      },
      {
        name: 'hart online',
        url: 'http://200.200.200.18:9000/rule/1721251459807-HART_Online.xlsx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=2xxSbNXQ3ayClsBEH1hZ%2F20240717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240717T212419Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=e9b3daee867da75b399fde74edc8b2325765999826ff327cedfd6c65473f48f4',
        fileName: '1721251459807-HART_Online.xlsx',
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
