import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CustomPrismaModule } from 'nestjs-prisma';
import { extendedPrismaClient } from 'src/common/pagination/prisma.extension';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from '../iam/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from '../iam/hashing/hashing.service';
import { BcryptService } from '../iam/hashing/bcrypt.service';
import { MinioService } from 'src/common/minio/minio.service';
import { OperationLogService } from '../monitor/operation-log/operation-log.service';
import { DeptModule } from './dept/dept.module';
import { DictTypeModule } from './dict-type/dict-type.module';
import { DictDataModule } from './dict-data/dict-data.module';
import { MenuModule } from './menu/menu.module';
import { RoleModule } from './role/role.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
    DeptModule,
    DictTypeModule,
    DictDataModule,
    MenuModule,
    RoleModule,
    PostModule,
  ],
  controllers: [UserController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    MinioService,
    UserService,
    OperationLogService,
  ],
  exports: [UserService],
})
export class SystemModule {}
