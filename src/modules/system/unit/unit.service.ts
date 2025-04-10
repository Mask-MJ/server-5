import { Inject, Injectable } from '@nestjs/common';
import { CreateUnitDto, QueryUnitDto, UpdateUnitDto } from './unit.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class UnitService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createUnitDto: CreateUnitDto) {
    return this.prismaService.client.unit.create({
      data: createUnitDto,
    });
  }

  async findAll(queryUnitDto: QueryUnitDto) {
    const { name, value, page, pageSize } = queryUnitDto;
    const [rows, meta] = await this.prismaService.client.unit
      .paginate({
        where: {
          name: { contains: name, mode: 'insensitive' },
          value: { contains: value },
        },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });

    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.unit.findUnique({ where: { id } });
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return this.prismaService.client.unit.update({
      where: { id },
      data: updateUnitDto,
    });
  }

  remove(id: number) {
    return this.prismaService.client.unit.delete({ where: { id } });
  }
}
