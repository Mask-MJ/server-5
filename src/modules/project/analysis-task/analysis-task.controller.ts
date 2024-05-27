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
import { AnalysisTaskService } from './analysis-task.service';
import {
  CreateAnalysisTaskDto,
  ExecuteAnalysisTaskDto,
  QueryAnalysisTaskDto,
  UpdateAnalysisTaskDto,
} from './analysis-task.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AnalysisTaskEntity } from './analysis-task.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('分析任务')
@ApiBearerAuth('bearer')
@Controller('analysis-task')
export class AnalysisTaskController {
  constructor(private readonly analysisTaskService: AnalysisTaskService) {}

  @Post()
  @ApiOperation({ summary: '创建分析任务' })
  @ApiCreatedResponse({ type: AnalysisTaskEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createAnalysisTaskDto: CreateAnalysisTaskDto,
  ) {
    return this.analysisTaskService.create(user, createAnalysisTaskDto);
  }

  @Get()
  @ApiOperation({ summary: '获取分析任务列表' })
  @ApiOkResponse({ type: AnalysisTaskEntity, isArray: true })
  findAll(@Query() queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    return this.analysisTaskService.findAll(queryAnalysisTaskDto);
  }

  // 执行分析任务
  @Post('execute')
  @ApiOperation({ summary: '执行分析任务' })
  execute(
    @ActiveUser() user: ActiveUserData,
    @Body() executeAnalysisTaskDto: ExecuteAnalysisTaskDto,
  ) {
    return this.analysisTaskService.execute(user, executeAnalysisTaskDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分析任务详情' })
  @ApiOkResponse({ type: AnalysisTaskEntity })
  findOne(@Param('id') id: number) {
    return this.analysisTaskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分析任务' })
  @ApiOkResponse({ type: AnalysisTaskEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateAnalysisTaskDto: UpdateAnalysisTaskDto,
  ) {
    return this.analysisTaskService.update(id, user, updateAnalysisTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除分析任务' })
  remove(@Param('id') id: number) {
    return this.analysisTaskService.remove(id);
  }
}
