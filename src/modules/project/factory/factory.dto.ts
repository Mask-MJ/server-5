import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { TimeDto } from 'src/common/dto/base.dto';

export class CreateFactoryDto {
  /**
   * 工厂名称
   * @example '工厂1'
   */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 工厂地址
   * @example '地址1'
   */
  @IsString()
  @IsOptional()
  address?: string;

  /**
   * 工厂坐标
   * @example [1, 1]
   */
  @IsNumber({}, { each: true })
  location?: number[] = [];

  /**
   * 工厂描述
   * @example '描述1'
   */
  @IsString()
  remark?: string = '';

  /**
   * 父级id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class QueryFactoryDto extends PartialType(
  IntersectionType(PickType(CreateFactoryDto, ['name']), TimeDto),
) {}

export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {}
