import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsString, MinLength, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
export class CreateContractDto {
  /**
   * 合同名称
   * @example '合同1'
   */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * 签订合同时间
   * @example '2021-01-01'
   */
  contractTime: string;

  /**
   * 采购阀门总数
   * @example 1000
   */
  @IsNumber()
  valveCount: number;

  /**
   * 高级阀门数量
   * @example 1000
   */
  @IsNumber()
  highValveCount: number;

  /**
   * 客户名称
   * @example '客户1'
   */
  @IsString()
  customer: string;

  /**
   * 客户联系方式
   * @example '123456789'
   */
  @IsString()
  customerPhone: string;

  /**
   * 销售人员
   * @example '销售1'
   */
  @IsString()
  saler: string;

  /**
   * 项目备注
   * @example '备注1'
   */
  @IsString()
  remark?: string = '';

  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  factoryId: number;
}

export class QueryContractDto extends PartialType(
  IntersectionType(PickType(CreateContractDto, ['name', 'customer']), BaseDto),
) {}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
