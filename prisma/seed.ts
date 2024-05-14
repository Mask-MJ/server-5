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
  await prisma.dept.createMany({
    data: [
      { name: '中国集团', createBy: 'admin' },
      { name: '北京分公司', createBy: 'admin', parentId: 1 },
      { name: '上海分公司', createBy: 'admin', parentId: 1 },
      { name: '广州分公司', createBy: 'admin', parentId: 1 },
      { name: '深圳分公司', createBy: 'admin', parentId: 1 },
      { name: '技术部', createBy: 'admin', parentId: 2 },
      { name: '销售部', createBy: 'admin', parentId: 2 },
      { name: '会计部', createBy: 'admin', parentId: 2 },
      { name: '技术部', createBy: 'admin', parentId: 3 },
      { name: '销售部', createBy: 'admin', parentId: 3 },
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
  // create menu
  await prisma.menu.create({
    data: {
      name: '首页',
      icon: 'dashboard',
      sort: 1,
      path: '/dashboard',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '工作台',
            icon: 'workbench',
            sort: 1,
            path: '/dashboard/workbench',
            createBy: 'admin',
          },
        ],
      },
    },
  });
  await prisma.menu.create({
    data: {
      name: '系统管理',
      icon: 'setting',
      sort: 2,
      path: '/system',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '用户管理',
            icon: 'user',
            sort: 1,
            path: '/system/user',
            createBy: 'admin',
          },
          {
            name: '角色管理',
            icon: 'team',
            sort: 2,
            path: '/system/role',
            createBy: 'admin',
          },
          {
            name: '菜单管理',
            icon: 'menu',
            sort: 3,
            path: '/system/menu',
            createBy: 'admin',
          },
          {
            name: '字典管理',
            icon: 'dictType',
            sort: 4,
            path: '/system/dictType',
            createBy: 'admin',
          },
          {
            name: '字典数据管理',
            icon: 'dictData',
            sort: 5,
            path: '/system/dictData',
            createBy: 'admin',
          },
          {
            name: '部门管理',
            icon: 'dept',
            sort: 6,
            path: '/system/dept',
            createBy: 'admin',
          },
          {
            name: '岗位管理',
            icon: 'post',
            sort: 7,
            path: '/system/post',
            createBy: 'admin',
          },
        ],
      },
    },
  });
  await prisma.menu.create({
    data: {
      name: '系统监控',
      icon: 'monitor',
      sort: 3,
      path: '/monitor',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '在线用户',
            icon: 'online',
            sort: 1,
            path: '/monitor/online',
            createBy: 'admin',
          },
          {
            name: '登录日志',
            icon: 'loginLog',
            sort: 2,
            path: '/monitor/loginLog',
            createBy: 'admin',
          },
          {
            name: '操作日志',
            icon: 'operationLog',
            sort: 3,
            path: '/monitor/operationLog',
            createBy: 'admin',
          },
        ],
      },
    },
  });

  console.log('注入数据成功');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
