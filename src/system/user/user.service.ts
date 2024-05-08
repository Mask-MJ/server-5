import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomPrismaService, PrismaService } from 'nestjs-prisma';
import type { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class UserService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    // private prisma: PrismaService,
  ) {
    // @Inject('PrismaService')
    // private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    // return this.prisma.user.findMany();
    // const [users, meta] = await this.prismaService.client.user
    //   .paginate()
    //   .withPages({ limit: 10, page: 1, includePageCount: true });
    // console.log(users, meta);
    // return {
    //   users,
    //   meta,
    // };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
