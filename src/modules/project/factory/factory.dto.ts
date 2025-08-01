import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
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
   * 行业
   * @example '新能源'
   */
  @IsString()
  @IsOptional()
  industry?: string;

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
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  filterId?: number;
}

export class UpdateFactoryDto extends PartialType(CreateFactoryDto) {
  @IsNumber()
  id: number;
}

export class importDto extends uploadDto {
  @IsNumber()
  @Type(() => Number)
  factoryId: number;

  @IsString()
  @IsOptional()
  reportMode?: string;
}

export class reportDto {
  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  factoryId?: number;
  /**
   * 分析任务id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  analysisTaskId?: number;
  /**
   * 报告模式
   * @example 'factory'
   */
  @IsString()
  @IsOptional()
  reportMode?: string;

  /**
   * 阀门ids
   * @example [1, 2, 3]
   */
  @IsOptional()
  @IsArray()
  valveTags?: string[];

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  cycle?: number;

  /**
   * 报告类型 1: 报告 2: 问题数据
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  type?: number;
}

export class chartDto {
  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  factoryId?: number;
  /**
   * 装置id
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  deviceId?: number;
  /**
   * 阀门品牌
   * @example '品牌 1'
   */
  @IsString()
  @IsOptional()
  valveBrand?: string;
  /**
   * 定位器型号
   * @example 'vls'
   */
  @IsString()
  @IsOptional()
  positionerModel?: string;
}
