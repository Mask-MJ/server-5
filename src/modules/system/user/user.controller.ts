import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  QueryUserDto,
  ChangePasswordDto,
} from './user.dto';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpRequest } from 'express';

@ApiTags('用户管理')
@ApiBearerAuth('bearer')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.userService.findAll(queryUserDto);
  }

  @Get('info')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ type: UserEntity })
  async findSelf(@ActiveUser() user: ActiveUserData) {
    return this.userService.findSelf(user.sub);
  }

  @Patch('changePassword')
  @ApiOperation({ summary: '修改密码' })
  @ApiOkResponse({ type: UserEntity })
  async changePassword(
    @Body() { id, oldPassword, password }: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, password, oldPassword);
  }

  @Post('uploadAvatar')
  @ApiOperation({ summary: '上传用户头像' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
          new FileTypeValidator({ fileType: /image\/(png|jpg|jpeg)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(user, file);
  }

  @Get('insertRedisData')
  @ApiOperation({ summary: '插入 Redis 数据' })
  insertRedisData() {
    return this.userService.insertRedisData();
  }

  @Get('saveRedisDataToDB')
  @ApiOperation({ summary: '保持 Redis 数据到数据库' })
  saveRedisDataToDB() {
    return this.userService.saveRedisDataToDB();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Request() request: ExpRequest,
  ) {
    return this.userService.remove(user, id, request);
  }
}
