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
                { name: '执行', value: 'project:analysisTask:execute' },
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
          {
            name: 'PDF树管理',
            icon: 'i-ant-design:control-outlined',
            sort: 9,
            path: '/system/dictDataTree',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:dictDataTree:create' },
                { name: '查询', value: 'system:dictDataTree:query' },
                { name: '修改', value: 'system:dictDataTree:update' },
                { name: '删除', value: 'system:dictDataTree:delete' },
              ],
            },
          },
          {
            name: '单位管理',
            icon: 'i-ant-design:medicine-box-outlined',
            sort: 4,
            path: '/system/unit',
            createBy: 'admin',
            permission: {
              create: [
                { name: '创建', value: 'system:unit:create' },
                { name: '查询', value: 'system:unit:query' },
                { name: '修改', value: 'system:unit:update' },
                { name: '删除', value: 'system:unit:delete' },
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
            name: '仪表组态-基本，转换块',
            value: 'Instrument Configuration-Basic, Transducer',
            children: {
              create: [
                {
                  name: '初始设置',
                  value: 'Initial Setup',
                  children: {
                    create: [
                      { name: '转换块模式', value: 'Transducer Block Mode' },
                      { name: '设置', value: 'Setup' },
                    ],
                  },
                },
                {
                  name: '整定',
                  value: 'Tuning',
                  children: {
                    create: [
                      {
                        name: '行程控制',
                        value: 'Travel Control',
                      },
                      {
                        name: '积分设置',
                        value: 'Integral Settings',
                      },
                      {
                        name: '压力控制',
                        value: 'Pressure Control',
                      },
                    ],
                  },
                },
                {
                  name: '行程/压力控制',
                  value: 'Travel/Pressure Control',
                  children: {
                    create: [
                      { name: '控制', value: 'Control' },
                      { name: '截止', value: 'Cutoff' },
                    ],
                  },
                },
                {
                  name: '输入特性化',
                  value: 'Input Characterization',
                },
              ],
            },
          },
          {
            name: '仪表组态-报警，转换块',
            value: 'Instrument Configuration-Alerts, Transducer',
            children: {
              create: [
                {
                  name: '电子部件报警',
                  value: 'Electronics Alerts',
                  children: {
                    create: [
                      {
                        name: '驱动电流',
                        value: 'Drive Current',
                      },
                      {
                        name: '驱动信号',
                        value: 'Drive Signal',
                      },
                      {
                        name: '处理器损坏',
                        value: 'Processor Impaired',
                      },
                    ],
                  },
                },
                {
                  name: '接近报警',
                  value: 'Proximity Alerts',
                  children: {
                    create: [
                      {
                        name: '行程开',
                        value: 'Travel Open',
                      },
                      {
                        name: '行程关',
                        value: 'Travel Closed',
                      },
                      {
                        name: '近接式',
                        value: 'Proximity',
                      },
                    ],
                  },
                },
                {
                  name: '组态报警',
                  value: 'Config Alerts',
                  children: {
                    create: [
                      {
                        name: '输出块超时',
                        value: 'Output Block Timeout',
                      },
                      {
                        name: '功能块设置为默认值',
                        value: 'Blocks Set to Defaults',
                      },
                      {
                        name: '关机报警',
                        value: 'Shutdown Alert',
                      },
                      {
                        name: '报警键',
                        value: 'Alert Key',
                      },
                    ],
                  },
                },
                {
                  name: '压力/温度报警',
                  value: 'Pressure/Temperature Alerts',
                  children: {
                    create: [
                      {
                        name: '供气压力',
                        value: 'Supply Pressure',
                      },
                      {
                        name: '温度限值',
                        value: 'Temperature Limit',
                      },
                    ],
                  },
                },
                {
                  name: '性能报警',
                  value: 'Performance Alerts',
                  children: {
                    create: [
                      {
                        name: '性能诊断',
                        value: 'Performance Diagnostic',
                      },
                      {
                        name: '性能临界',
                        value: 'Performance Critical',
                      },
                      {
                        name: '性能降低',
                        value: 'Performance Reduced',
                      },
                      { name: '性能信息', value: 'Performance Information' },
                    ],
                  },
                },
                {
                  name: '模拟 PWA',
                  value: 'Simulate PWA',
                  children: {
                    create: [
                      { name: '模拟状态', value: 'Simulation Status' },
                      { name: '组态报警', value: 'Config Alerts' },
                      { name: '电子部件报警', value: 'Electronics Alerts' },
                      {
                        name: '压力/温度报警',
                        value: 'Pressure/Temperature Alerts',
                      },
                      { name: '性能报警', value: 'Performance Alerts' },
                      { name: '传感器报警', value: 'Sensor Alerts' },
                      { name: '行程报警', value: 'Travel Alerts' },
                      { name: '行程历史报警', value: 'Travel History Alerts' },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '仪表组态-报警，转换块(控制)',
            value: 'Instrument Configuration-Alerts, Transducer(cont.)',
            children: {
              create: [
                {
                  name: '行程报警',
                  value: 'Travel Alerts',
                  children: {
                    create: [
                      { name: '行程偏差', value: 'Travel Deviation' },
                      { name: '行程限位', value: 'Travel Limit' },
                      { name: '行程高限位', value: 'Travel Limit High' },
                      { name: '行程低限位', value: 'Travel Limit Low' },
                    ],
                  },
                },
                {
                  name: '传感器报警',
                  value: 'Sensor Alerts',
                  children: {
                    create: [
                      {
                        name: '行程传感器',
                        value: 'Travel Sensor',
                      },
                      {
                        name: '输出压力传感器',
                        value: 'Output Pressure Sensor',
                      },
                      {
                        name: '供气压力传感器',
                        value: 'Supply Pressure Sensor',
                      },
                      {
                        name: '温度传感器',
                        value: 'Temperature Sensor',
                      },
                      {
                        name: '压力切换激活',
                        value: 'Pressure Fallback Active',
                      },
                    ],
                  },
                },
                {
                  name: '行程历史报警',
                  value: 'Travel History Alerts',
                  children: {
                    create: [
                      { name: '循环计数高', value: 'Cycle Count High' },
                      { name: '行程累计器', value: 'Travel Accumulator' },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '仪表组态-规格表，转换块',
            value: 'Instrument Configuration-Spec Sheet, Transducer',
            children: {
              create: [
                {
                  name: '仪表',
                  value: 'Instrument',
                  children: {
                    create: [
                      { name: '单位', value: 'Units' },
                      { name: '仪表', value: 'Instrument' },
                      { name: '标定', value: 'Calibration' },
                      { name: '标定数据', value: 'Calibration Data' },
                    ],
                  },
                },
                {
                  name: 'MAI 通道',
                  value: 'MAI Channels',
                  children: {
                    create: [{ name: 'MAI 通道', value: 'MAI Channels' }],
                  },
                },
                { name: '阀门', value: 'Valve' },
                {
                  name: '内件',
                  value: 'Trim',
                  children: {
                    create: [
                      {
                        name: '其他直通式阀内件选项',
                        value: 'Extra Sliding Stem Valve Trim Options',
                      },
                    ],
                  },
                },
                { name: '执行机构', value: 'Actuator' },
                { name: '参考', value: 'Reference' },
              ],
            },
          },
          {
            name: '仪表组态-资源块',
            value: 'Instrument Configuration-Resource Block',
            children: {
              create: [
                {
                  name: '模式',
                  value: 'Mode',
                  children: {
                    create: [
                      { name: '资源块模式', value: 'Resource Block Mode' },
                    ],
                  },
                },
                { name: '写锁定', value: 'Write Lock' },
                { name: '通讯超时', value: 'Comm Timeout' },
                {
                  name: '选项',
                  value: 'Options',
                  children: {
                    create: [{ name: '功能选择', value: 'Feature Select' }],
                  },
                },
                {
                  name: '警报处理',
                  value: 'Alarm Handling',
                  children: {
                    create: [
                      { name: '全部警报', value: 'All Alarms' },
                      { name: '块警报', value: 'Block Alarm' },
                      { name: '写入警报', value: 'Write Alarm' },
                    ],
                  },
                },
                {
                  name: '仪表',
                  value: 'Instrument',
                  children: {
                    create: [
                      {
                        name: '仪表描述',
                        value: 'Instrument Description',
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
            children: {
              create: [
                { name: '监视器', value: 'Monitor' },
                {
                  name: '仪表',
                  value: 'Instrument',
                  children: {
                    create: [
                      { name: '转换块', value: 'TRANSDUCER' },
                      { name: '资源块', value: 'RESOURCE' },
                    ],
                  },
                },
                {
                  name: '块状态',
                  value: 'Block Status',
                  children: {
                    create: [
                      { name: '转换块', value: 'TRANSDUCER' },
                      { name: '资源块', value: 'RESOURCE' },
                    ],
                  },
                },
                {
                  name: '组态',
                  value: 'Config',
                  children: {
                    create: [
                      {
                        name: '输出块超时',
                        value: 'Output Block Timeout',
                      },
                      {
                        name: '功能块设置为默认值',
                        value: 'Blocks Set to Defaults',
                      },
                      { name: '关机报警', value: 'Shutdown Alert' },
                    ],
                  },
                },
                {
                  name: '压力/温度',
                  value: 'Pressure/Temperature',
                  children: {
                    create: [
                      { name: '供气压力', value: 'Supply Pressure' },
                      { name: '温度限值', value: 'Temperature Limit' },
                    ],
                  },
                },
                {
                  name: '传感器',
                  value: 'Sensor',
                  children: {
                    create: [
                      { name: '行程传感器', value: 'Travel Sensor' },
                      {
                        name: '输出压力传感器',
                        value: 'Output Pressure Sensor',
                      },
                      {
                        name: '供气压力传感器',
                        value: 'Supply Pressure Sensor',
                      },
                      {
                        name: '温度传感器',
                        value: 'Temperature Sensor',
                      },
                      {
                        name: '压力切换激活',
                        value: 'Pressure Fallback Active',
                      },
                    ],
                  },
                },
                {
                  name: '电子部件',
                  value: 'Electronic',
                  children: {
                    create: [
                      { name: '驱动电流', value: 'Drive Current' },
                      { name: '驱动信号', value: 'Drive Signal' },
                      { name: '处理器损坏', value: 'Processor Impaired' },
                    ],
                  },
                },
                {
                  name: '近接式',
                  value: 'Proximity',
                  children: {
                    create: [{ name: '接近报警', value: 'Proximity Alerts' }],
                  },
                },
                {
                  name: '行程',
                  value: 'Travel',
                  children: {
                    create: [
                      { name: '行程偏差', value: 'Travel Deviation' },
                      { name: '行程限位', value: 'Travel Limit' },
                      { name: '行程高限位', value: 'Travel Limit High' },
                      { name: '行程低限位', value: 'Travel Limit Low' },
                    ],
                  },
                },
                {
                  name: '行程历史记录',
                  value: 'Travel History',
                  children: {
                    create: [
                      { name: '行程累计高', value: 'Travel Accumulator High' },
                      { name: '循环计数高', value: 'Cycle Count High' },
                    ],
                  },
                },
                {
                  name: '临界性能',
                  value: 'Perf Critical',
                  children: {
                    create: [
                      { name: '性能临界', value: 'Performance Critical' },
                      { name: '可能原因', value: 'Possible Cause' },
                    ],
                  },
                },
                {
                  name: '性能信息',
                  value: 'Perf Info',
                  children: {
                    create: [
                      { name: '性能信息', value: 'Performance Information' },
                      { name: '可能原因', value: 'Possible Cause' },
                      { name: '其他信息', value: 'Other Information' },
                    ],
                  },
                },
                {
                  name: '降低性能',
                  value: 'Perf Reduced',
                  children: {
                    create: [
                      { name: '性能降低', value: 'Performance Reduced' },
                      { name: '可能原因', value: 'Possible Cause' },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: '阶跃响应',
            value: 'Step Response',
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
              create: [{ name: '注释', value: 'Notes' }],
            },
          },
          {
            name: '完全扫描',
            value: 'Total Scan',
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
            name: '完全扫描-注释',
            value: 'Total Scan-Notes',
            children: {
              create: [{ name: '注释', value: 'Notes' }],
            },
          },
          {
            name: '完全扫描-规格表',
            value: 'Total Scan-Spec Sheet',
            children: {
              create: [
                { name: '阀门', value: 'Valve' },
                { name: '内件', value: 'Trim' },
                { name: '执行机构', value: 'Actuator' },
              ],
            },
          },
          {
            name: '阀门摩擦力性能诊断',
            value: 'Valve Friction Performance Diagnostic',
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
