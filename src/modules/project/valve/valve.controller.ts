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
import { ValveService } from './valve.service';
import { CreateValveDto, QueryValveDto, UpdateValveDto } from './valve.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { ValveEntity } from './valve.entity';

@ApiTags('阀门管理')
@ApiBearerAuth('bearer')
@Controller('valve')
export class ValveController {
  constructor(private readonly valveService: ValveService) {}

  @Post()
  @ApiOperation({ summary: '创建阀门' })
  @ApiCreatedResponse({ type: ValveEntity })
  create(@Body() createValveDto: CreateValveDto) {
    return this.valveService.create(createValveDto);
  }

  @Get()
  @ApiOperation({ summary: '获取阀门列表' })
  @ApiOkResponse({ type: ValveEntity, isArray: true })
  findAll(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.findAll(queryValveDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取阀门信息' })
  @ApiOkResponse({ type: ValveEntity })
  findOne(@Param('id') id: number) {
    return this.valveService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新阀门信息' })
  @ApiOkResponse({ type: ValveEntity })
  update(@Param('id') id: number, @Body() updateValveDto: UpdateValveDto) {
    return this.valveService.update(id, updateValveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除阀门' })
  remove(@Param('id') id: number) {
    return this.valveService.remove(id);
  }
}
