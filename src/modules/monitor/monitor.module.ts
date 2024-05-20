import { Module } from '@nestjs/common';
import { LoginLogController } from './login-log/login-log.controller';
import { LoginLogService } from './login-log/login-log.service';
import { OperationLogController } from './operation-log/operation-log.controller';
import { OperationLogService } from './operation-log/operation-log.service';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { InfoController } from '../monitor/info/info.controller';
import { InfoService } from '../monitor/info/info.service';
@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
  ],
  controllers: [OperationLogController, LoginLogController, InfoController],
  providers: [OperationLogService, LoginLogService, InfoService],
})
export class MonitorModule {}
