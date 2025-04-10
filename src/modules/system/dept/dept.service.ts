import { Inject, Injectable } from '@nestjs/common';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './dept.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class DeptService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createDeptDto: CreateDeptDto) {
    return this.prismaService.client.dept.create({
      data: { ...createDeptDto, createBy: user.account },
    });
  }

  async findAll(queryDeptDto: QueryDeptDto) {
    const { name } = queryDeptDto;
    // https://github.com/prisma/prisma/issues/3725
    // https://github.com/prisma/prisma/issues/4562
    return this.prismaService.client.dept.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        parentId: !name ? null : undefined,
      },
      include: {
        children: {
          include: { children: { orderBy: { sort: 'asc' } } },
          orderBy: { sort: 'asc' },
        },
      },
      orderBy: { sort: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prismaService.client.dept.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateDeptDto: UpdateDeptDto) {
    return this.prismaService.client.dept.update({
      where: { id },
      data: { ...updateDeptDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.dept.delete({ where: { id } });
  }
}
