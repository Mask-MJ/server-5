import { Inject, Injectable } from '@nestjs/common';
import {
  CreateFactoryDto,
  importDto,
  QueryFactoryDto,
  UpdateFactoryDto,
} from './factory.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { read, utils } from 'xlsx';
import dayjs from 'dayjs';

@Injectable()
export class FactoryService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}
  create(user: ActiveUserData, createFactoryDto: CreateFactoryDto) {
    return this.prismaService.client.factory.create({
      data: { ...createFactoryDto, createBy: user.account },
    });
  }

  async findAll(user: ActiveUserData, queryFactoryDto: QueryFactoryDto) {
    const { name, beginTime, endTime } = queryFactoryDto;
    const userData = await this.prismaService.client.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });
    if (userData.isAdmin) {
      return this.prismaService.client.factory.findMany({
        where: {
          name: { contains: name },
          parentId: !name ? null : undefined,
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: { children: true },
      });
    } else {
      const roleIds = userData.role.map((item) => item.id);
      return this.prismaService.client.factory.findMany({
        where: {
          OR: [
            { createBy: user.account },
            { role: { some: { id: { in: roleIds } } } },
          ],
          name: { contains: name },
          parentId: !name ? null : undefined,
          createdAt: { gte: beginTime, lte: endTime },
        },
        include: { children: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async import(
    user: ActiveUserData,
    file: Express.Multer.File,
    body: importDto,
  ) {
    const workbook = read(file.buffer, { type: 'buffer' });
    const xslx = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const deviceNames: string[] = [];
    xslx.forEach((item: any) => {
      // 获取所有的 装置 名称
      if (item['装置'] && !deviceNames.includes(item['装置'])) {
        deviceNames.push(item['装置']);
      }
    });
    deviceNames.forEach(async (deviceName) => {
      let device = await this.prismaService.client.device.findFirst({
        where: { name: deviceName, factoryId: body.factoryId },
      });
      if (!device) {
        device = await this.prismaService.client.device.create({
          data: {
            name: deviceName,
            factoryId: body.factoryId,
            createBy: user.account,
          },
        });
      }
      xslx
        .filter((item: any) => item['装置'] === deviceName)
        .forEach(async (item: any) => {
          const valve = await this.prismaService.client.valve.findFirst({
            where: { tag: item['Tag'], deviceId: device.id },
          });
          const data = {
            // no: item['Order Number']
            tag: item['Tag'],
            serialNumber: String(item['系列号']),
            valveSize: String(item['Valve Size']),
            valveType: item['Valve Type'],
            // class: item['Class'],
            valveEndConnection: item['End Connection'],
            valveBodyMaterial: item['Body Material'],
            // valveTrimMaterial: item['内件材质'],
            valveSeatLeakage: item['泄漏等级'],
            valveBonnet: item['阀盖形式'],
            since: dayjs(item['使用年份'].slice(0, -1)).toDate(),
            deviceId: device.id,
            factoryId: body.factoryId,
            updateBy: user.account,
          };
          if (valve) {
            await this.prismaService.client.valve.update({
              where: { id: valve.id },
              data,
            });
            // 记录有多少个阀门被更新
          } else {
            await this.prismaService.client.valve.create({ data });
          }
        });
    });
    return { success: true };
  }

  findOne(id: number) {
    return this.prismaService.client.factory.findUnique({ where: { id } });
  }

  update(id: number, user: ActiveUserData, updateFactoryDto: UpdateFactoryDto) {
    return this.prismaService.client.factory.update({
      where: { id },
      data: { ...updateFactoryDto, updateBy: user.account },
    });
  }

  remove(id: number) {
    return this.prismaService.client.factory.delete({ where: { id } });
  }
}
