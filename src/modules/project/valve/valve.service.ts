import { Inject, Injectable } from '@nestjs/common';
import { CreateValveDto, QueryValveDto, UpdateValveDto } from './valve.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class ValveService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createValveDto: CreateValveDto) {
    return this.prismaService.client.valve.create({
      data: createValveDto,
    });
  }

  async findAll(queryValveDto: QueryValveDto) {
    const { name, page, pageSize } = queryValveDto;
    const [rows, meta] = await this.prismaService.client.valve
      .paginate({
        where: { name: { contains: name } },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.valve.findUnique({ where: { id } });
  }

  update(id: number, updateValveDto: UpdateValveDto) {
    return this.prismaService.client.device.update({
      where: { id },
      data: updateValveDto,
    });
  }

  remove(id: number) {
    return this.prismaService.client.valve.delete({ where: { id } });
  }
}
