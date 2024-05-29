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
import { AnalysisTaskService } from './analysis-task/analysis-task.service';
import { AnalysisTaskController } from './analysis-task/analysis-task.controller';
import { MinioService } from 'src/common/minio/minio.service';

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
    AnalysisTaskController,
  ],
  providers: [
    ContractService,
    DeviceService,
    FactoryService,
    ValveService,
    AnalysisTaskService,
    MinioService,
  ],
})
export class ProjectModule {}
