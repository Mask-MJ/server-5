import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
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
  status: number = 0;
  /**
   * pdf路径
   * @example [{name: 'pdf1', url: 'http://xxx.com/xxx.pdf'}]
   */
  @IsArray()
  pdf: { name: string; url: string }[] = [];

  /**
   * 数据字典ID
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  dictTypeId: number;
  /**
   * 工厂ID
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  factoryId: number;
  /**
   * 规则ID
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  ruleId: number;
  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  remark: string = '';
}

export class QueryAnalysisTaskDto extends PartialType(
  IntersectionType(
    PickType(CreateAnalysisTaskDto, ['name', 'status', 'factoryId']),
    BaseDto,
  ),
) {}

export class UpdateAnalysisTaskDto extends PartialType(CreateAnalysisTaskDto) {
  @IsNumber()
  id: number;
}
