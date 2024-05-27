import { LoginLog } from '@prisma/client';

export class LoginLogEntity implements LoginLog {
  id: number;
  userId: number;
  sessionId: string;
  account: string;
  ip: string;
  address: string;
  createdAt: Date;
}
