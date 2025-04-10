import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './post.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class PostService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(user: ActiveUserData, createPostDto: CreatePostDto) {
    return this.prismaService.client.post.create({
      data: { ...createPostDto, createBy: user.account },
    });
  }

  async findAll(queryPostDto: QueryPostDto) {
    const { name, code, page, pageSize } = queryPostDto;
    const [rows, meta] = await this.prismaService.client.post
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          code: { contains: code, mode: 'insensitive' },
        },
        orderBy: { sort: 'asc' },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.post.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updatePostDto: UpdatePostDto) {
    return this.prismaService.client.post.update({
      where: { id },
      data: { ...updatePostDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.post.delete({ where: { id } });
  }
}
