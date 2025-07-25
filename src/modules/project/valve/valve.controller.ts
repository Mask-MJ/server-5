import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  Headers,
} from '@nestjs/common';
import { ValveService } from './valve.service';
import {
  CreateValveDto,
  QueryValveChartDto,
  QueryValveDto,
  QueryValveHistoryListDto,
  QueryValveWorkOrderDto,
  UpdateValveDto,
  ValveHistoryScoreDto,
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
  ValveHistoryListEntity,
  ValveRunInfoEntity,
} from './valve.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';
import { Request as ExpRequest } from 'express';

@ApiTags('阀门管理')
@ApiBearerAuth('bearer')
@Controller('valve')
export class ValveController {
  constructor(private readonly valveService: ValveService) {}

  @Post()
  @ApiOperation({ summary: '创建阀门' })
  @ApiCreatedResponse({ type: ValveEntity })
  @Permissions('project:valve:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createValveDto: CreateValveDto,
  ) {
    return this.valveService.create(user, createValveDto);
  }

  @Get()
  @ApiOperation({ summary: '获取阀门列表' })
  @ApiPaginatedResponse(ValveEntity)
  @Permissions('project:valve:query')
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryValveDto: QueryValveDto,
  ) {
    return this.valveService.findAll(user, queryValveDto);
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有阀门列表' })
  @ApiPaginatedResponse(ValveEntity)
  @Permissions('project:valve:query')
  findAllExport(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.findAllExport(queryValveDto);
  }

  @Get('run-info/:id')
  @ApiOperation({ summary: '获取阀门运行信息' })
  @ApiOkResponse({ type: ValveRunInfoEntity })
  @Permissions('project:valve:query')
  findRunInfo(@Param('id') id: number) {
    return this.valveService.findRunInfo(id);
  }

  // 获取阀门历史数据列表
  @Get('history')
  @ApiOperation({ summary: '获取阀门历史数据列表' })
  @ApiPaginatedResponse(ValveHistoryListEntity)
  @Permissions('project:valve:query')
  findAllHistoryDataList(
    @Query() queryValveHistoryListDto: QueryValveHistoryListDto,
  ) {
    return this.valveService.findAllHistoryDataList(queryValveHistoryListDto);
  }

  @Get('HealthScoreTrendPlot/:id')
  @ApiOperation({ summary: '获取阀门健康评分趋势图' })
  @ApiPaginatedResponse(ValveHistoryEntity)
  @Permissions('project:valve:query')
  findHealthScoreTrendPlot(@Param('id') id: number) {
    return this.valveService.findHealthScoreTrendPlot(id);
  }

  @Get('history/:id')
  @ApiOperation({ summary: '获取阀门历史数据列表详情' })
  @ApiPaginatedResponse(ValveHistoryEntity)
  @Permissions('project:valve:query')
  findHistoryData(@Param('id') id: number) {
    return this.valveService.findHistoryData(id);
  }

  @Get('historyChart')
  @ApiOperation({ summary: '获取阀门历史运行数据详情' })
  @ApiPaginatedResponse(ValveHistoryEntity)
  @Permissions('project:valve:query')
  findHistoryChartData(@Query() queryValveChartDto: QueryValveChartDto) {
    return this.valveService.findHistoryChartData(queryValveChartDto);
  }

  @Get('score/:id')
  @ApiOperation({ summary: '获取阀门评分' })
  @ApiOkResponse({ type: ValveHistoryEntity, isArray: true })
  @Permissions('project:valve:query')
  findScoreData(@Param('id') id: number) {
    return this.valveService.findScoreData(id);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取阀门树' })
  @ApiOkResponse({ type: ValveEntity, isArray: true })
  @Permissions('project:valve:query')
  findTree() {
    return this.valveService.getTreeStructure();
  }

  // 全部删除
  @Delete('removeAll')
  @ApiOperation({ summary: '删除所有阀门' })
  @Permissions('project:valve:delete')
  removeAll(
    @ActiveUser() user: ActiveUserData,
    @Request() request: ExpRequest,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.valveService.removeAll(user, ip || request.ip);
  }

  // 阀门历史评分
  @Get('historyScore')
  @ApiOperation({ summary: '获取阀门历史评分' })
  @Permissions('project:valve:query')
  findHistoryScoreData(
    @Query() queryValveHistoryScoreDto: ValveHistoryScoreDto,
  ) {
    console.log('queryValveHistoryScoreDto', queryValveHistoryScoreDto);
    return this.valveService.findHistoryScoreData(queryValveHistoryScoreDto);
  }

  // 获取阀门关联的工单
  @Get('workOrder')
  @ApiOperation({ summary: '获取阀门关联的工单' })
  @ApiOkResponse({ type: ValveEntity, isArray: true })
  @Permissions('project:valve:query')
  findWorkOrder(@Query() queryValveWorkOrderDto: QueryValveWorkOrderDto) {
    return this.valveService.findWorkOrder(queryValveWorkOrderDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取阀门信息' })
  @ApiOkResponse({ type: ValveEntity })
  @Permissions('project:valve:query')
  findOne(@Param('id') id: number) {
    return this.valveService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新阀门信息' })
  @ApiOkResponse({ type: ValveEntity })
  @Permissions('project:valve:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateValveDto: UpdateValveDto,
  ) {
    return this.valveService.update(id, user, updateValveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除阀门' })
  @Permissions('project:valve:delete')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Request() request: ExpRequest,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.valveService.remove(user, id, ip || request.ip);
  }
}
