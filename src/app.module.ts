import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validate/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { RedisStorage } from './common/redis/redis.storage';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { SystemModule } from './modules/system/system.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ProjectModule } from './modules/project/project.module';
import { IamModule } from './modules/iam/iam.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 30000, limit: 10 }]),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    RouterModule.register([
      { path: 'project', module: ProjectModule },
      { path: 'system', module: SystemModule },
      { path: 'monitor', module: MonitorModule },
    ]),
    IamModule,
    SystemModule,
    MonitorModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    RedisStorage,
    providePrismaClientExceptionFilter(),
  ],
})
export class AppModule {}
