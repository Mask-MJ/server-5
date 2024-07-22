import { Inject, Injectable } from '@nestjs/common';
import {
  CreateDictDataDto,
  QueryDictDataDto,
  UpdateDictDataDto,
} from './dict-data.dto';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class DictDataService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(user: ActiveUserData, createDictDataDto: CreateDictDataDto) {
    return this.prismaService.client.dictData.create({
      data: { ...createDictDataDto, createBy: user.account },
    });
  }

  async findAll(queryDictDataDto: QueryDictDataDto) {
    const { name, value, dictTypeId, page, pageSize } = queryDictDataDto;
    const [rows, meta] = await this.prismaService.client.dictData
      .paginate({
        where: {
          name: { contains: name },
          value: { contains: value },
          dictTypeId,
        },
        orderBy: { sort: 'asc' },
        include: { tree: true },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.dictData.findUnique({ where: { id } });
  }

  update(
    id: number,
    user: ActiveUserData,
    updateDictDataDto: UpdateDictDataDto,
  ) {
    console.log('updateDictDataDto', updateDictDataDto);
    return this.prismaService.client.dictData.update({
      where: { id },
      data: { ...updateDictDataDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.dictData.delete({ where: { id } });
  }
}
