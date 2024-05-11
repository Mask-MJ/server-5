import { Module } from '@nestjs/common';

import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { ContractService } from './contract/contract.service';
import { ContractController } from './contract/contract.controller';
import { FactoryService } from './factory/factory.service';
import { FactoryController } from './factory/factory.controller';
import { DeviceService } from './device/device.service';
import { DeviceController } from './device/device.controller';
import { ValveService } from './valve/valve.service';
import { ValveController } from './valve/valve.controller';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
  ],
  controllers: [
    ContractController,
    DeviceController,
    FactoryController,
    ValveController,
  ],
  providers: [ContractService, DeviceService, FactoryService, ValveService],
})
export class ProjectModule {}
