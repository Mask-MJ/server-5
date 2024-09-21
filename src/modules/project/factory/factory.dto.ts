import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { TimeDto, uploadDto } from 'src/common/dto/base.dto';

export class CreateFactoryDto {
  /**
   * 工厂名称
   * @example '工厂1'
   */
  @IsString()
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
   * 地址编码
   * @example '130010'
   */
  @IsString()
  @IsOptional()
  code?: string;

  /**
   * 省份
   * @example '广东省'
   */
  @IsString()
  @IsOptional()
  province?: string;

  /**
   * 城市
   * @example '广州市'
   */
  @IsString()
  @IsOptional()
  city?: string;

  /**
   * 区县
   * @example '天河区'
   */
  @IsString()
  @IsOptional()
  county?: string;

  /**
   * 工厂地址
   * @example '地址1'
   */
  @IsString()
  @IsOptional()
  address?: string;

  /**
   * 工厂坐标(经度)
   * @example 1.1
   */
  @IsString()
  longitude?: string = '';

  /**
   * 工厂坐标(纬度)
   * @example 1.1
   */
  @IsString()
  latitude?: string = '';

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
  @Type(() => Number)
  @IsOptional()
  parentId?: number;
}

export class QueryFactoryDto extends PartialType(
  IntersectionType(PickType(CreateFactoryDto, ['name']), TimeDto),
) {}

export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {
  @IsNumber()
  id: number;
}

export class importDto extends uploadDto {
  @IsNumber()
  @Type(() => Number)
  factoryId: number;
}
