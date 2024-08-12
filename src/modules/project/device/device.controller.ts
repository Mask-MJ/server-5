import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto, QueryDeviceDto, UpdateDeviceDto } from './device.dto';
import { DeviceEntity } from './device.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';

@ApiTags('装置管理')
@ApiBearerAuth('bearer')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({ summary: '创建装置' })
  @ApiCreatedResponse({ type: DeviceEntity })
  @Permissions('project:device:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    return this.deviceService.create(user, createDeviceDto);
  }

  @Get()
  @ApiOperation({ summary: '获取装置列表' })
  @ApiPaginatedResponse(DeviceEntity)
  @Permissions('project:device:query')
  findAll(@Query() queryDeviceDto: QueryDeviceDto) {
    return this.deviceService.findAll(queryDeviceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取装置信息' })
  @ApiOkResponse({ type: DeviceEntity })
  @Permissions('project:device:query')
  findOne(@Param('id') id: number) {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新装置' })
  @ApiOkResponse({ type: DeviceEntity })
  @Permissions('project:device:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.deviceService.update(id, user, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除装置' })
  @Permissions('project:device:delete')
  remove(@Param('id') id: number) {
    return this.deviceService.remove(id);
  }
}
