import { Valve } from '@prisma/client';

export class ValveEntity implements Valve {
  id: number;
  name: string;
  brand: string;
  model: string;
  serial: string;
  caliber: string;
  level: string;
  material: string;
  leak: string;
  actuator: string;
  locator: string;
  fault: string;
  deviceId: number | null;
  analysisTaskId: number | null;
  status: boolean;
  remark: string;
  factoryId: number;
  createBy: string;
  updateBy: string;
  createdAt: Date;
  updatedAt: Date;
}
