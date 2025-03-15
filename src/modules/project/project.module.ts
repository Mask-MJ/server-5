import { Module, Logger } from '@nestjs/common';

import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { MinioService } from 'src/common/minio/minio.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { projectControllers, projectProviders } from './index';

@Module({
  imports: [
    HttpModule.register({}),
    ScheduleModule.forRoot(),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
  ],
  controllers: projectControllers,
  providers: [...projectProviders, MinioService, Logger],
})
export class ProjectModule {}
