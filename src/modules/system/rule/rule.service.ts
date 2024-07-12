import { Inject, Injectable } from '@nestjs/common';
import { CreateRuleDto, QueryRuleDto, UpdateRuleDto } from './rule.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class RuleService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly minioClient: MinioService,
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

  async upload(user: ActiveUserData, file: Express.Multer.File, body: any) {
    // 加上时间戳，避免文件名重复
    const fileName = `${Date.now()}-${body.fileName}`;
    await this.minioClient.uploadFile('rule', fileName, file.buffer);
    const url = await this.minioClient.getUrl('rule', fileName);
    return { url, name: fileName };
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
