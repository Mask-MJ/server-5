import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import dayjs from 'dayjs';
import { BaseDto } from 'src/common/dto/base.dto';
export class CreateContractDto {
  /**
   * 合同名称
   * @example '合同1'
   */
  @IsString()
  name: string;

  /**
   * 签订合同时间
   * @example 1714752000000
   */
  @Type(() => Number)
  @Transform(({ value }) => dayjs(value).format(), { toClassOnly: true })
  @IsOptional()
  contractTime: Date;

  /**
   * 采购阀门总数
   * @example 1000
   */
  @IsNumber()
  @Type(() => Number)
  valveCount: number;

  /**
   * 高级阀门数量
   * @example 1000
   */
  @IsNumber()
  @IsOptional()
  highValveCount?: number;

  /**
   * 客户名称
   * @example '客户1'
   */
  @IsString()
  customer: string = '';

  /**
   * 客户联系方式
   * @example '123456789'
   */
  @IsString()
  customerPhone?: string = '';

  /**
   * 销售人员
   * @example '销售1'
   */
  @IsString()
  saler?: string = '';

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
  @Type(() => Number)
  factoryId: number;
}

export class QueryContractDto extends PartialType(
  IntersectionType(
    PickType(CreateContractDto, ['name', 'customer', 'factoryId']),
    BaseDto,
  ),
) {}

export class UpdateContractDto extends PartialType(CreateContractDto) {
  @IsNumber()
  id: number;
}
