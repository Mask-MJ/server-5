import { Body, Controller, Post } from '@nestjs/common';
import { ServiceAppService } from './service.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateServiceAppDto } from './service.dto';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/modules/iam/authentication/enums/auth-type.enum';

@ApiTags('外部接口通讯')
@Auth(AuthType.None)
@Controller('service-app')
export class ServiceAppController {
  constructor(private readonly serviceAppService: ServiceAppService) {}

  @Post()
  @ApiOperation({ summary: '数据同步' })
  create(@Body() createServiceAppDto: CreateServiceAppDto) {
    return this.serviceAppService.create(createServiceAppDto);
  }
}
