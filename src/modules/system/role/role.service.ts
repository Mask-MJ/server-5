import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './role.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class RoleService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createRoleDto: CreateRoleDto) {
    return this.prismaService.client.role.create({
      data: {
        ...createRoleDto,
        createBy: user.account,
        menu: { connect: createRoleDto.menuIds.map((id) => ({ id })) },
        factory: { connect: createRoleDto.factoryIds.map((id) => ({ id })) },
      },
    });
  }

  async findAll(queryRoleDto: QueryRoleDto) {
    const { name, value, page, pageSize } = queryRoleDto;
    const [rows, meta] = await this.prismaService.client.role
      .paginate({
        where: { name: { contains: name }, value: { contains: value } },
      })
      .withPages({ page, limit: pageSize });
    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.role.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateRoleDto: UpdateRoleDto) {
    return this.prismaService.client.role.update({
      where: { id },
      data: {
        ...updateRoleDto,
        updateBy: user.account,
        menu: { connect: updateRoleDto.menuIds.map((id) => ({ id })) },
        factory: { connect: updateRoleDto.factoryIds.map((id) => ({ id })) },
      },
    });
  }

  remove(id: number) {
    return this.prismaService.client.role.delete({ where: { id } });
  }
}
