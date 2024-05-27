import { Inject, Injectable } from '@nestjs/common';
import { CreateLoginLogDto, QueryLoginDto } from './login-log.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import IP2Region from 'ip2region';

@Injectable()
export class LoginLogService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  async create(createLoginLogDto: CreateLoginLogDto) {
    const query = new IP2Region();
    const addressInfo = query.search(createLoginLogDto.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';
    return this.prismaService.client.loginLog.create({
      data: { ...createLoginLogDto, address },
    });
  }

  async findAll(queryLoginDto: QueryLoginDto) {
    const { pageSize, page, account } = queryLoginDto;
    const [rows, meta] = await this.prismaService.client.loginLog
      .paginate({
        where: { account },
        orderBy: { createdAt: 'desc' },
      })
      .withPages({ limit: pageSize, page, includePageCount: true });

    return { rows, ...meta };
  }

  findOne(id: number) {
    return this.prismaService.client.loginLog.findUnique({ where: { id } });
  }
}
