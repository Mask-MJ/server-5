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

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly hashingService: HashingService,
    private readonly minioClient: MinioService,
    private readonly operationLogService: OperationLogService,
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
    return this.prismaService.client.user.create({
      data: {
        ...createUserDto,
        role: { connect: createUserDto.roleIds?.map((id) => ({ id })) },
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
    return userWithoutPassword;
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
    return this.prismaService.client.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        role: { connect: updateUserDto.roleIds?.map((id) => ({ id })) },
      },
    });
  }

  async remove(user: ActiveUserData, id: number, request: Request) {
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

    return this.prismaService.client.user.update({
      where: { id: user.sub },
      data: {
        avatar: `http://39.105.100.190:9000/avatar/${file.originalname}`,
      },
    });
  }
}
