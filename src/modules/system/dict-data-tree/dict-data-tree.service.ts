import { Inject, Injectable } from '@nestjs/common';
import {
  CreateDictDataTreeDto,
  QueryDictDataTreeDto,
  UpdateDictDataTreeDto,
} from './dict-data-tree.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class DictDataTreeService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createDictDataTreeDto: CreateDictDataTreeDto) {
    return this.prismaService.client.dictDataTree.create({
      data: createDictDataTreeDto,
    });
  }

  async findAll(queryDictDataTreeDto: QueryDictDataTreeDto) {
    const { name } = queryDictDataTreeDto;
    return this.prismaService.client.dictDataTree.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        parentId: !name ? null : undefined,
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
      },
    });
  }

  findAllList() {
    return this.prismaService.client.dictDataTree.findMany();
  }

  findOne(id: number) {
    return this.prismaService.client.dictDataTree.findUnique({ where: { id } });
  }

  update(id: number, updateDictDataTreeDto: UpdateDictDataTreeDto) {
    return this.prismaService.client.dictDataTree.update({
      where: { id },
      data: updateDictDataTreeDto,
    });
  }

  remove(id: number) {
    return this.prismaService.client.dictDataTree.delete({ where: { id } });
  }
}
