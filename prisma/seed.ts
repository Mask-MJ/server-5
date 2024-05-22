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
  await prisma.menu.create({
    data: {
      name: '系统管理',
      icon: 'i-ant-design:setting-outlined',
      sort: 2,
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
          },
          {
            name: '角色管理',
            icon: 'i-ant-design:usergroup-add-outlined',
            sort: 2,
            path: '/system/role',
            createBy: 'admin',
          },
          {
            name: '菜单管理',
            icon: 'i-ant-design:menu-outlined',
            sort: 3,
            path: '/system/menu',
            createBy: 'admin',
          },
          {
            name: '字典管理',
            icon: 'i-ant-design:medicine-box-outlined',
            sort: 4,
            path: '/system/dictType',
            createBy: 'admin',
          },
          {
            name: '字典数据管理',
            icon: 'i-ant-design:medicine-box-outlined',
            sort: 5,
            path: '/system/dictData',
            createBy: 'admin',
          },
          {
            name: '部门管理',
            icon: 'i-ant-design:gold-twotone',
            sort: 6,
            path: '/system/dept',
            createBy: 'admin',
          },
          {
            name: '岗位管理',
            icon: 'i-ant-design:golden-filled',
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
      icon: 'i-ant-design:android-filled',
      sort: 3,
      path: '/monitor',
      createBy: 'admin',
      children: {
        create: [
          {
            name: '在线用户',
            icon: 'i-ant-design:aim-outlined',
            sort: 1,
            path: '/monitor/online',
            createBy: 'admin',
          },
          {
            name: '登录日志',
            sort: 2,
            icon: 'i-ant-design:contacts-outlined',
            path: '/monitor/loginLog',
            createBy: 'admin',
          },
          {
            name: '操作日志',
            sort: 3,
            icon: 'i-ant-design:cloud-server-outlined',
            path: '/monitor/operationLog',
            createBy: 'admin',
          },
          {
            name: '服务器监控',
            icon: 'i-ant-design:fund-projection-screen-outlined',
            sort: 4,
            path: '/monitor/info',
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
