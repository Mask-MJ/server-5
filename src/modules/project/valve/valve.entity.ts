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
  deviceId: number;
  status: boolean;
  remark: string;
  factoryId: number;
  createdAt: Date;
  updatedAt: Date;
}
