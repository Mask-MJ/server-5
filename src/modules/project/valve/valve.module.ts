import { Module } from '@nestjs/common';
import { ValveService } from './valve.service';
import { ValveController } from './valve.controller';

@Module({
  controllers: [ValveController],
  providers: [ValveService],
})
export class ValveModule {}
