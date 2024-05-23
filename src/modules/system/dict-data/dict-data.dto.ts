import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateDictDataDto {
  /**
   * 字典数据名称
   * @example '性别'
   */
  @IsString()
  name: string;

  /**
   * 字典数据值
   * @example '1'
   */
  @IsString()
  value: string;

  /**
   * 排序
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  sort?: number;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  /**
   * 字典类型ID
   * @example 1
   */
  @IsNumber()
  dictTypeId: number;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryDictDataDto extends PartialType(
  IntersectionType(PickType(CreateDictDataDto, ['name', 'value']), BaseDto),
) {}

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {}
