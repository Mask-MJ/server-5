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
  QueryValveHistoryListDto,
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
  ValveHistoryListEntity,
  ValveRunInfoEntity,
} from './valve.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';

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
  @ApiPaginatedResponse(ValveEntity)
  findAll(@Query() queryValveDto: QueryValveDto) {
    return this.valveService.findAll(queryValveDto);
  }

  @Get('run-info/:id')
  @ApiOperation({ summary: '获取阀门运行信息' })
  @ApiOkResponse({ type: ValveRunInfoEntity })
  findRunInfo(@Param('id') id: number) {
    return this.valveService.findRunInfo(id);
  }

  // 获取阀门历史数据列表
  @Get('history')
  @ApiOperation({ summary: '获取阀门历史数据列表' })
  @ApiPaginatedResponse(ValveHistoryListEntity)
  findAllHistoryDataList(
    @Query() queryValveHistoryListDto: QueryValveHistoryListDto,
  ) {
    return this.valveService.findAllHistoryDataList(queryValveHistoryListDto);
  }

  @Get('history/:id')
  @ApiOperation({ summary: '获取阀门历史数据列表详情' })
  @ApiPaginatedResponse(ValveHistoryEntity)
  findHistoryData(@Param('id') id: number) {
    return this.valveService.findHistoryData(id);
  }

  @Get('score/:id')
  @ApiOperation({ summary: '获取阀门评分' })
  @ApiOkResponse({ type: ValveHistoryEntity, isArray: true })
  findScoreData(@Param('id') id: number) {
    return this.valveService.findScoreData(id);
  }

  @Get('tree')
  @ApiOperation({ summary: '获取阀门树' })
  @ApiOkResponse({ type: ValveEntity, isArray: true })
  findTree() {
    return this.valveService.getTreeStructure();
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
