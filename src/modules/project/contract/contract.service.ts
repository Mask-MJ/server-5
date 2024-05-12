import { Inject, Injectable } from '@nestjs/common';
import {
  CreateContractDto,
  QueryContractDto,
  UpdateContractDto,
} from './contract.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class ContractService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  create(user: ActiveUserData, createContractDto: CreateContractDto) {
    return this.prismaService.client.contract.create({
      data: { ...createContractDto, createBy: user.account },
    });
  }

  async findAll(queryContractDto: QueryContractDto) {
    const { name, customer, page, pageSize } = queryContractDto;
    const [rows, meta] = await this.prismaService.client.contract
      .paginate({
        where: { name: { contains: name }, customer: { contains: customer } },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.contract.findUnique({ where: { id } });
  }

  update(
    id: number,
    user: ActiveUserData,
    updateContractDto: UpdateContractDto,
  ) {
    return this.prismaService.client.contract.update({
      where: { id },
      data: { ...updateContractDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.contract.delete({ where: { id } });
  }
}
