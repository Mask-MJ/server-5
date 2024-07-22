import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateDictDataTreeDto {
  /**
   * PDF树名称
   * @example '仪表组态-基本'
   */
  @IsString()
  name: string;

  /**
   * PDF树 数据值
   * @example 'Instrument Configuration-Basic'
   */
  @IsString()
  value: string;

  /**
   * 绑定的字典数据id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  dictDataId: number;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;

  /**
   * 父级菜单id
   * @example 0
   */
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class QueryDictDataTreeDto extends PartialType(
  IntersectionType(PickType(CreateDictDataTreeDto, ['name', 'value']), BaseDto),
) {}

export class UpdateDictDataTreeDto extends PartialType(CreateDictDataTreeDto) {
  @IsNumber()
  id: number;
}
