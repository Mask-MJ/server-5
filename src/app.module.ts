import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validate/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { RedisStorage } from './common/redis/redis.storage';
import {
  CustomPrismaModule,
  PrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { SystemModule } from './system/system.module';
import { extendedPrismaClient } from './common/pagination/prisma.extension';

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
    // PrismaModule.forRoot({ isGlobal: true }),
    RouterModule.register([
      // { path: 'project', module: ProjectModule },
      { path: 'system', module: SystemModule },
      // { path: 'monitor', module: MonitorModule },
    ]),
    SystemModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    RedisStorage,
    providePrismaClientExceptionFilter(),
  ],
})
export class AppModule {}
