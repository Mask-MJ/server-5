import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import type { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './user.dto';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { HashingService } from 'src/modules/iam/hashing/hashing.service';
import { MinioService } from 'src/common/minio/minio.service';
import { OperationLogService } from 'src/modules/monitor/operation-log/operation-log.service';
import { Request } from 'express';
import IP2Region from 'ip2region';
import { ConfigService } from '@nestjs/config';
import { RedisStorage } from 'src/common/redis/redis.storage';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly hashingService: HashingService,
    private readonly minioClient: MinioService,
    private readonly operationLogService: OperationLogService,
    private configService: ConfigService,
    private readonly redisStorage: RedisStorage,
  ) {}

  // Exclude keys from user
  // https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
    ) as Omit<User, Key>;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.client.user.findUnique({
      where: { account: createUserDto.account },
    });
    if (existingUser) {
      throw new ConflictException('账号已存在');
    }
    const { roleIds, ...rest } = createUserDto;
    return this.prismaService.client.user.create({
      data: {
        ...rest,
        password: await this.hashingService.hash(createUserDto.password),
        role: { connect: roleIds?.map((id) => ({ id })) },
      },
    });
  }

  findSelf(id: number) {
    return this.prismaService.client.user.findUniqueOrThrow({
      where: { id },
      include: {
        role: { include: { menu: { include: { permission: true } } } },
      },
    });
  }

  async findAll(queryUserDto: QueryUserDto) {
    const {
      account,
      nickname,
      email,
      phoneNumber,
      page,
      pageSize,
      beginTime,
      endTime,
    } = queryUserDto;

    const [rows, meta] = await this.prismaService.client.user
      .paginate({
        where: {
          account: { contains: account },
          nickname: { contains: nickname },
          email: { contains: email },
          phoneNumber: { contains: phoneNumber },
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: { role: true },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return {
      rows: rows.map((user) => this.exclude(user, ['password'])),
      ...meta,
    };
  }

  async findOne(id: number) {
    const user = await this.prismaService.client.user.findUniqueOrThrow({
      where: { id },
      include: { role: true },
    });
    const userWithoutPassword = this.exclude(user, ['password']);
    return {
      ...userWithoutPassword,
      roleIds: user.role.map((role) => role.id),
    };
  }

  async changePassword(id: number, password: string, oldPassword: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new ConflictException('用户不存在');
    }
    // 判断是否是管理员权限 如果是管理员权限则不需要验证原密码
    if (user.isAdmin) {
      return this.prismaService.client.user.update({
        where: { id },
        data: { password: await this.hashingService.hash(password) },
      });
    }
    const isPasswordValid = await this.hashingService.compare(
      oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ConflictException('原密码错误');
    }
    const newPassword = await this.hashingService.hash(password);
    return this.prismaService.client.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { roleIds, ...rest } = updateUserDto;
    return this.prismaService.client.user.update({
      where: { id },
      data: {
        ...rest,
        role: { connect: roleIds?.map((id) => ({ id })) },
      },
    });
  }

  async remove(user: ActiveUserData, id: number, request: Request) {
    // 判断是否是管理员账号, 如果是管理员账号则不允许删除
    const userInfo = await this.prismaService.client.user.findUnique({
      where: { id },
    });
    if (userInfo.isAdmin) {
      throw new ConflictException('管理员账号不允许删除');
    }
    const deleteUser = await this.prismaService.client.user.delete({
      where: { id },
    });
    const query = new IP2Region();
    const addressInfo = query.search(request.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';

    await this.operationLogService.create({
      account: user.account,
      module: '用户管理',
      businessType: 1,
      title: '删除用户',
      ip: request.ip,
      address,
    });
    return deleteUser;
  }

  async uploadAvatar(user: ActiveUserData, file: Express.Multer.File) {
    await this.minioClient.uploadFile('avatar', file.originalname, file.buffer);
    const url = await this.minioClient.getUrl('avatar', file.originalname);
    return this.prismaService.client.user.update({
      where: { id: user.sub },
      data: { avatar: url },
    });
  }

  // // 在 redis 中插入10条数据
  // async insertRedisData() {
  //   // this.redisStorage.flushAll();
  //   // 开始时间
  //   const startTime = new Date();
  //   for (let i = 0; i < 100000; i++) {
  //     await this.redisStorage.setList(`key-${i}`, [
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //       'a',
  //       'b',
  //       'c',
  //     ]);
  //   }
  //   // 结束时间耗时
  //   console.log('结束时间耗时', new Date().getTime() - startTime.getTime());
  //   return '插入成功';
  // }

  // // 定时任务, 把 redis 中的数据存储到数据库中
  // async saveRedisDataToDB() {
  //   // 获取所有的 key
  //   const startTime = new Date();
  //   const keys = await this.redisStorage.getkeys(`key-*`);
  //   const data: { key: string; value: string }[] = [];
  //   for (let i = 0; i < keys.length; i++) {
  //     const key = keys[i];
  //     const value = await this.redisStorage.getList(key);
  //     data.push({ key, value: value.join(',') });
  //   }
  //   await this.prismaService.client.redisData.createMany({
  //     data,
  //   });

  //   // 插入到数据库成功后清空 redis 中的数据
  //   await this.redisStorage.flushAll();

  //   console.log('结束时间耗时', new Date().getTime() - startTime.getTime());
  //   return '插入成功';
  // }
}
