import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';
import { FactoryEntity } from '../../project/factory/factory.entity';
import { CreateValveDto } from 'src/modules/project/valve/valve.dto';
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
  endUser: FactoryEntity;
  /**
   * 阀门信息
   * @example [{valveId: 1, valveName: '阀门1'}]
   */
  @IsArray()
  valves: CreateValveDto[];
  /**
   * 工单数据
   * @example '{}'
   */
  @IsObject()
  workSheet: {
    taskDescription: string;
    possibleCauseAnalysis: string;
    faultCategory: string;
    remedialActions: string;
    recommendation: string;
  };
}
