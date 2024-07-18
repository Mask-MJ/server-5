import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateRuleDto {
  /**
   * 规则名称
   * @example 'hard-规则-20240609'
   */
  @IsString()
  name: string;
  /**
   * 文件路径
   * @example 'http://xxx.com/xxx.xslx'
   */
  @IsString()
  url: string;
  /**
   * 文件名
   * @example '文件名'
   */
  @IsString()
  fileName: string;
  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryRuleDto extends PartialType(
  IntersectionType(PickType(CreateRuleDto, ['name']), BaseDto),
) {}

export class UpdateRuleDto extends PartialType(CreateRuleDto) {
  @IsNumber()
  id: number;
}
