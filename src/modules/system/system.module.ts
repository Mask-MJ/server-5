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
import { DeptService } from './dept/dept.service';
import { DeptController } from './dept/dept.controller';
import { DictDataService } from './dict-data/dict-data.service';
import { DictDataController } from './dict-data/dict-data.controller';
import { DictTypeService } from './dict-type/dict-type.service';
import { DictTypeController } from './dict-type/dict-type.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { AnalysisTaskService } from './analysis-task/analysis-task.service';
import { AnalysisTaskController } from './analysis-task/analysis-task.controller';
import { UnitService } from './unit/unit.service';
import { UnitController } from './unit/unit.controller';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    CustomPrismaModule.forRootAsync({
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
  ],
  controllers: [
    UserController,
    DeptController,
    DictDataController,
    DictTypeController,
    MenuController,
    RoleController,
    PostController,
    AnalysisTaskController,
    UnitController,
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    MinioService,
    UserService,
    OperationLogService,
    DeptService,
    DictDataService,
    DictTypeService,
    MenuService,
    RoleService,
    PostService,
    AnalysisTaskService,
    UnitService,
  ],
  exports: [UserService],
})
export class SystemModule {}
