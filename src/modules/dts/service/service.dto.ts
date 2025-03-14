import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateServiceAppDto {
  /**
   * 工单ID
   * @example "1"
   */
  @IsString()
  id: string;
  /**
   * 工单类型代码
   * @example "1"
   */
  @IsNumber()
  type: number;
  /**
   * 工单类型名称
   * @example "现场服务"
   */
  @IsString()
  typeName: string;
  /**
   * 流水号
   * @example 1
   */
  @IsString()
  serial: string;
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
   * @example [{valveId: 1, valveName: '阀门1'}]
   */
  @IsArray()
  valves: Record<string, any>[];
  /**
   * 工单数据
   * @example '{}'
   */
  @IsObject()
  workSheet: Record<string, any>;
}
