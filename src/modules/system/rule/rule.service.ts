import { Inject, Injectable } from '@nestjs/common';
import { CreateRuleDto, QueryRuleDto, UpdateRuleDto } from './rule.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Injectable()
export class RuleService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(createRuleDto: CreateRuleDto) {
    return this.prismaService.client.rule.create({
      data: createRuleDto,
    });
  }

  async findAll(queryRuleDto: QueryRuleDto) {
    const { name, page, pageSize } = queryRuleDto;
    const [rows, meta] = await this.prismaService.client.rule
      .paginate({
        where: { name: { contains: name } },
      })
      .withPages({ page, limit: pageSize, includePageCount: true });

    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.rule.findUnique({ where: { id } });
  }

  update(id: number, updateRuleDto: UpdateRuleDto) {
    return this.prismaService.client.rule.update({
      where: { id },
      data: updateRuleDto,
    });
  }

  remove(id: number) {
    return this.prismaService.client.rule.delete({ where: { id } });
  }
}
