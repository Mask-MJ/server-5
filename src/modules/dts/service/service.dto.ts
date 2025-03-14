import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateServiceAppDto {
  /**
   * 工单ID
   * @example 1
   */
  @IsNumber()
  id: number;
  /**
   * 工单类型代码
   * @example 1
   */
  @IsNumber()
  type: number;
  /**
   * 工单类型名称
   * @example '1'
   */
  @IsString()
  typeName: string;
  /**
   * 流水号
   * @example 1
   */
  @IsNumber()
  serial: number;
  /**
   * 服务报告文档URL
   * @example 'xxx'
   */
  @IsString()
  attachment: string;
  /**
   * 最终用户信息
   * @example '{}'
   */
  @IsObject()
  endUser: Record<string, any>;
  /**
   * 阀门信息
   * @example '{}'
   */
  @IsObject()
  valves: Record<string, any>;
  /**
   * 工单数据
   * @example '{}'
   */
  @IsObject()
  workSheet: Record<string, any>;
}
