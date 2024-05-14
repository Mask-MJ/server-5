import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateAnalysisTaskDto {
  /**
   * 任务名称
   * @example '分析任务1'
   */
  @IsString()
  name: string;
  /**
   * 状态 (0: 待执行, 1: 执行中, 2: 已完成, 3: 失败)
   * @example 1
   */
  @IsEnum([0, 1, 2, 3])
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  status: number;
  /**
   * pdf路径
   * @example ['path1', 'path2']
   */
  @IsString({ each: true })
  pdfPath: string[];
  /**
   * 数据字典ID
   * @example 1
   */
  @IsNumber()
  dictId: number;
  /**
   * 工厂ID
   * @example 1
   */
  @IsNumber()
  factoryId: number;
  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

class AnalysisTaskDto {
  /**
   * 数据字典ID
   * @example 1
   */
  @IsNumber()
  id: number;
}

export class QueryAnalysisTaskDto extends PartialType(
  IntersectionType(
    PickType(CreateAnalysisTaskDto, ['name', 'status', 'factoryId']),
    BaseDto,
  ),
) {}

export class ExecuteAnalysisTaskDto extends PartialType(
  IntersectionType(
    PickType(CreateAnalysisTaskDto, ['dictId', 'pdfPath', 'factoryId']),
    AnalysisTaskDto,
  ),
) {}

export class UpdateAnalysisTaskDto extends PartialType(CreateAnalysisTaskDto) {}
