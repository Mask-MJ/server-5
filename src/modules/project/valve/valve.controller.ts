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
import {
  CreateValveDto,
  QueryValveDto,
  QueryValveHistoryDto,
  UpdateValveDto,
} from './valve.dto';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  ValveEntity,
  ValveHistoryEntity,
  ValveRunInfoEntity,
} from './valve.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('阀门管理')
@ApiBearerAuth('bearer')
@Controller('valve')
export class ValveController {
  constructor(private readonly valveService: ValveService) {}

  @Post()
  @ApiOperation({ summary: '创建阀门' })
  @ApiCreatedResponse({ type: ValveEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createValveDto: CreateValveDto,
  ) {
    return this.valveService.create(user, createValveDto);
  }

  @Get()
  @ApiOperation({ summary: '获取阀门列表' })
  @ApiOkResponse({ type: ValveEntity, isArray: true })
  findAll(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.findAll(queryValveDto);
  }

  @Get('run-info/:id')
  @ApiOperation({ summary: '获取阀门运行信息' })
  @ApiOperation({ summary: '获取阀门信息' })
  @ApiOkResponse({ type: ValveRunInfoEntity })
  findOne(@Param('id') id: number) {
    return this.valveService.findOne(id);
  }

  @Get('history/:id')
  @ApiOperation({ summary: '获取阀门历史数据' })
  @ApiOkResponse({ type: ValveHistoryEntity, isArray: true })
  findHistory(
    @Param('id') id: number,
    @Query() queryValveHistoryDto: QueryValveHistoryDto,
  ) {
    return this.valveService.findHistory(id, queryValveHistoryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新阀门信息' })
  @ApiOkResponse({ type: ValveEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateValveDto: UpdateValveDto,
  ) {
    return this.valveService.update(id, user, updateValveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除阀门' })
  remove(@Param('id') id: number) {
    return this.valveService.remove(id);
  }
}
