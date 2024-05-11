import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validate/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { RedisStorage } from './common/redis/redis.storage';
import {
  CustomPrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { SystemModule } from './modules/system/system.module';
import { extendedPrismaClient } from './common/pagination/prisma.extension';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ContractModule } from './modules/project/contract/contract.module';
import { DeviceModule } from './modules/project/device/device.module';
import { FactoryModule } from './modules/project/factory/factory.module';
import { ValveModule } from './modules/project/valve/valve.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 30000, limit: 10 }]),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
    RouterModule.register([
      // { path: 'project', module: ProjectModule },
      { path: 'system', module: SystemModule },
      { path: 'monitor', module: MonitorModule },
    ]),
    SystemModule,
    MonitorModule,
    ContractModule,
    DeviceModule,
    FactoryModule,
    ValveModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    RedisStorage,
    providePrismaClientExceptionFilter(),
  ],
})
export class AppModule {}
