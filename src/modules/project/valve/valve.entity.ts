import { Valve, ValveData, ValveDataHistory } from '@prisma/client';

export class ValveEntity implements Valve {
  id: number;
  /// 阀门位号
  tag: string;
  /// 装置
  unit: string;
  /// 介质
  fluidName: string;
  /// 关键应用
  criticalApplication: string;
  /// 阀体序列号
  serialNumber: string;
  /// 投用时间
  since: Date;
  /// 阀体品牌
  valveBrand: string;
  /// 阀体类型
  valveType: string;
  /// 阀体口径
  valveSize: string;
  /// 阀体连接形式
  valveEndConnection: string;
  /// 阀体阀体材质
  valveBodyMaterial: string;
  /// 阀盖形式
  valveBonnet: string;
  /// 阀内件
  valveTrim: string;
  /// 阀体泄漏等级
  valveSeatLeakage: string;
  /// 阀体描述
  valveDescription: string;
  /// 执行机构品牌
  actuatorBrand: string;
  /// 执行机构类型
  actuatorType: string;
  /// 执行机构尺寸
  actuatorSize: string;
  /// 手轮
  handwheel: string;
  /// 执行机构描述
  actuatorDescription: string;
  /// 定位器品牌
  positionerBrand: string;
  /// 定位器类型
  positionerType: string;
  /// 定位器描述
  positionerDescription: string;
  /// 附件种类
  accessory: string;
  /// 附件品牌
  accessoryBrand: string;
  /// 附件类型
  accessoryType: string;
  /// 附件数量
  accessoryQuantity: number;
  accessoryDescription: string;
  /// 仪表品牌
  instrumentBrand: string;
  /// 仪表类型
  instrumentType: string;
  /// 仪表描述
  instrumentDescription: string;
  remark: string;
  /// 关联装置id
  deviceId: number;
  /// 分析任务id
  analysisTaskId: number;
  factoryId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ValveRunInfoEntity implements ValveData {
  /// 阀门id
  id: number;
  /// 状态名
  name: string;
  /// 状态值
  value: string;
  /// 单位
  unit: string;
  /// 读取时间
  time: Date;
  /// 阀门id
  valveId: number;
}

export class ValveHistoryEntity implements ValveDataHistory {
  /// 阀门id
  id: number;
  /// 状态名
  name: string;
  /// 状态值
  value: string;
  /// 单位
  unit: string;
  /// 读取时间
  time: Date;
  /// 阀门id
  valveId: number;
}
