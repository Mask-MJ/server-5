import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsPhoneNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateUserDto {
  /**
   * 账号
   * @example 'admin'
   */
  @IsString()
  @MinLength(4)
  account: string;

  /**
   * 密码
   * @example '123456'
   */
  @IsString()
  @MinLength(4)
  password: string;

  /**
   * 昵称
   * @example '管理员'
   */
  @IsString()
  @IsOptional()
  nickname?: string;

  /**
   * 头像
   * @example 'http://xxx.com/xxx.jpg'
   */
  @IsString()
  @IsOptional()
  avatar?: string;

  /**
   * 邮箱
   * @example 'xxx@qq.com'
   */
  @IsEmail()
  @IsOptional()
  email?: string;

  /**
   * 手机号
   * @example '18888888888'
   */
  @IsPhoneNumber('CN')
  @IsOptional()
  phoneNumber?: string;

  /**
   * 性别 0: 女 1: 男
   * @example 1
   */
  @IsOptional()
  @IsEnum([0, 1, 2])
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  sex?: number;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;

  /**
   * 岗位ID
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  postId?: number;

  /**
   * 部门ID
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  deptId?: number;

  /**
   * 角色ID
   * @example [1, 2]
   */
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  roleIds?: number[];

  /**
   * 菜单ID
   * @example [1, 2]
   */
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  menuIds?: number[];
}

export class QueryUserDto extends PartialType(
  IntersectionType(
    PickType(CreateUserDto, [
      'account',
      'nickname',
      'email',
      'phoneNumber',
      'sex',
    ]),
    BaseDto,
  ),
) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
