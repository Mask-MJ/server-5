import { Module, Logger } from '@nestjs/common';
import { ServiceAppController } from './service/service.controller';
import { ServiceAppService } from './service/service.service';
@Module({
  imports: [],
  controllers: [ServiceAppController],
  providers: [ServiceAppService, Logger],
})
export class DtsModule {}
