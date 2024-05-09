import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from 'src/common/pagination/prisma.extension';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => {
        return extendedPrismaClient;
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class SystemModule {}
