import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { BaseDto, TimeDto } from 'src/common/dto/base.dto';
import dayjs from 'dayjs';

export class CreateValveDto {
  /**
   * 阀门位号
   * @example 'FV-3001B'
   */
  @IsString()
  tag: string;

  /**
   * 装置
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  unit?: string;

  /**
   * 来源
   * @example 'hart'
   */
  @IsString()
  @IsOptional()
  source?: string;

  /**
   * 介质
   * @example '氨水'
   */
  @IsString()
  @IsOptional()
  fluidName?: string;

  /**
   * 关键应用
   * @example '反应器'
   */
  @IsString()
  @IsOptional()
  criticalApplication?: string;

  /**
   * 阀体序列号
   * @example '123456'
   */
  @IsString()
  @IsOptional()
  serialNumber?: string;

  /**
   * 投用时间
   * @example 1714752000000
   */
  @IsOptional()
  @Transform(({ value }) => (value ? dayjs(value).format() : null), {
    toClassOnly: true,
  })
  since?: Date;

  /**
   * 阀体品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  valveBrand?: string;

  /**
   * 系列
   * @example '系列'
   */
  @IsString()
  @IsOptional()
  valveSeries?: string;

  /**
   * 阀体类型
   * @example '球阀'
   */
  @IsString()
  @IsOptional()
  valveType?: string;

  /**
   * 阀体口径
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  valveSize?: string;

  /**
   * 阀体连接形式
   * @example '法兰'
   */
  @IsString()
  @IsOptional()
  valveEndConnection?: string;

  /**
   * 阀体阀体材质
   * @example '碳钢'
   */
  @IsString()
  @IsOptional()
  valveBodyMaterial?: string;

  /**
   * 阀盖形式
   * @example '法兰'
   */
  @IsString()
  @IsOptional()
  valveBonnet?: string;

  /**
   * 阀内件
   * @example '316'
   */
  @IsString()
  @IsOptional()
  valveTrim?: string;

  /**
   * 阀体泄漏等级
   * @example 'V'
   */
  @IsString()
  @IsOptional()
  valveSeatLeakage?: string;

  /**
   * 阀体描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  valveDescription?: string;

  /**
   * 执行机构品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  actuatorBrand?: string;

  /**
   * 执行机构类型
   * @example '气动'
   */
  @IsString()
  @IsOptional()
  actuatorType?: string;

  /**
   * 执行机构尺寸
   * @example 'DN50'
   */
  @IsString()
  @IsOptional()
  actuatorSize?: string;

  /**
   * 手轮
   * @example '有'
   */
  @IsString()
  @IsOptional()
  handwheel?: string;

  /**
   * 执行机构描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  actuatorDescription?: string;

  /**
   * 定位器品牌
   * @example 'Fisher'
   */
  @IsString()
  @IsOptional()
  positionerBrand?: string;

  /**
   * 定位器类型
   * @example '气动'
   */
  @IsString()
  @IsOptional()
  positionerType?: string;

  /**
   * 定位器描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  positionerDescription?: string;

  /**
   * 附件种类
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessory?: string;

  /**
   * 附件品牌
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryBrand?: string;

  /**
   * 附件类型
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryType?: string;

  /**
   * 附件数量
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  accessoryQuantity?: number;

  /**
   * 附件描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  accessoryDescription?: string;

  /**
   * 仪表品牌
   * @example '...'
   */
  @IsString()
  @IsOptional()
  instrumentBrand?: string;

  /**
   * 仪表类型
   * @example '...'
   */
  @IsString()
  @IsOptional()
  instrumentType?: string;

  /**
   * 仪表描述
   * @example '...'
   */
  @IsString()
  @IsOptional()
  instrumentDescription?: string;

  /**
   * 备注
   * @example '...'
   */
  @IsString()
  @IsOptional()
  remark?: string;

  /**
   * 装置id
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deviceId?: number;

  /**
   * 工厂id
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  factoryId: number;

  /**
   * 分析任务id
   * @example 1
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  analysisTaskId?: number;
}
export class QueryValveDto extends PartialType(
  IntersectionType(
    PickType(CreateValveDto, [
      'tag',
      'factoryId',
      'deviceId',
      'analysisTaskId',
      'serialNumber',
      'valveSeries',
    ]),
    BaseDto,
  ),
) {}

export class QueryValveChartDto extends PartialType(TimeDto) {
  @IsNumber()
  @Type(() => Number)
  keywordId: number;

  @IsNumber()
  @Type(() => Number)
  valveId: number;
}

export class UpdateValveDto extends PartialType(CreateValveDto) {
  @IsNumber()
  id: number;
}
export class ValveDto {
  @IsNumber()
  @Type(() => Number)
  valveId: number;
}
export class QueryValveHistoryListDto extends PartialType(
  IntersectionType(ValveDto, BaseDto),
) {}
