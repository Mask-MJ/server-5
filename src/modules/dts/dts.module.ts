import { Module } from '@nestjs/common';
import { ServiceAppController } from './service/service.controller';
import { ServiceAppService } from './service/service.service';
@Module({
  imports: [],
  controllers: [ServiceAppController],
  providers: [ServiceAppService],
})
export class DtsModule {}
