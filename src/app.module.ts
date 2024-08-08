import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './common/validate/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { RedisStorage } from './common/redis/redis.storage';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { SystemModule } from './modules/system/system.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ProjectModule } from './modules/project/project.module';
import { IamModule } from './modules/iam/iam.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { UserConsumer } from './modules/system/user/user.processor';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 10 }]),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    RouterModule.register([
      { path: 'project', module: ProjectModule },
      { path: 'system', module: SystemModule },
      { path: 'monitor', module: MonitorModule },
    ]),
    EventEmitterModule.forRoot(),
    IamModule,
    SystemModule,
    MonitorModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    RedisStorage,
    UserConsumer,
    providePrismaClientExceptionFilter(),
  ],
})
export class AppModule {}
