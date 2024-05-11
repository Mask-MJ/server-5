import { Module } from '@nestjs/common';
import { DictDataService } from './dict-data.service';
import { DictDataController } from './dict-data.controller';

@Module({
  controllers: [DictDataController],
  providers: [DictDataService],
})
export class DictDataModule {}
