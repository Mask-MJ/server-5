import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateUnitDto {
  /**
   * 权限名称
   * @example '管理员'
   */
  @IsString()
  name: string;
  /**
   * 权限值
   * @example 'admin'
   */
  @IsString()
  value: string;
  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryUnitDto extends PartialType(
  IntersectionType(PickType(CreateUnitDto, ['name', 'value']), BaseDto),
) {}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
