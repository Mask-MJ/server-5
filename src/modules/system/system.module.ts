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
import { UnitService } from './unit/unit.service';
import { UnitController } from './unit/unit.controller';
import { RuleService } from './rule/rule.service';
import { RuleController } from './rule/rule.controller';
import { RedisStorage } from 'src/common/redis/redis.storage';
import { DictDataTreeController } from './dict-data-tree/dict-data-tree.controller';
import { DictDataTreeService } from './dict-data-tree/dict-data-tree.service';

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
    UnitController,
    RuleController,
    DictDataTreeController,
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
    UnitService,
    RuleService,
    RedisStorage,
    DictDataTreeService,
  ],
  exports: [UserService],
})
export class SystemModule {}
