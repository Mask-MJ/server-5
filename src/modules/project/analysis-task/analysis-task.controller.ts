import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
  Headers,
} from '@nestjs/common';
import { AnalysisTaskService } from './analysis-task.service';
import {
  CreateAnalysisTaskDto,
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
import {
  AnalysisTaskEntity,
  AnalysisTaskResultEntity,
} from './analysis-task.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadDto } from 'src/common/dto/base.dto';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';
import { Request as ExpRequest } from 'express';

@ApiTags('分析任务')
@ApiBearerAuth('bearer')
@Controller('analysis-task')
export class AnalysisTaskController {
  constructor(private readonly analysisTaskService: AnalysisTaskService) {}

  @Post()
  @ApiOperation({ summary: '创建分析任务' })
  @ApiCreatedResponse({ type: AnalysisTaskEntity })
  @Permissions('project:analysisTask:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createAnalysisTaskDto: CreateAnalysisTaskDto,
    @Request() request: ExpRequest,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.analysisTaskService.create(
      user,
      createAnalysisTaskDto,
      ip || request.ip,
    );
  }

  @Get()
  @ApiOperation({ summary: '获取分析任务列表' })
  @ApiPaginatedResponse(AnalysisTaskEntity)
  @Permissions('project:analysisTask:query')
  findAll(@Query() queryAnalysisTaskDto: QueryAnalysisTaskDto) {
    return this.analysisTaskService.findAll(queryAnalysisTaskDto);
  }

  // 执行分析任务
  @Post('execute/:id')
  @ApiOperation({ summary: '执行分析任务' })
  // @Permissions('project:analysisTask:execute')
  execute(@ActiveUser() user: ActiveUserData, @Param('id') id: number) {
    return this.analysisTaskService.execute(user, id);
  }

  @Get('clear')
  @ApiOperation({ summary: '清理PDF表中url后缀' })
  clear() {
    return this.analysisTaskService.clear();
  }

  @Post('uploadPdf')
  @ApiOperation({ summary: '上传PDF文件' })
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: uploadDto,
  ) {
    return this.analysisTaskService.uploadPdf(user, file, body);
  }

  // 分析任务结果
  @Get('result/:id')
  @ApiOperation({ summary: '获取分析任务结果' })
  @ApiOkResponse({ type: AnalysisTaskResultEntity })
  @Permissions('project:analysisTask:query')
  result(@Param('id') id: number) {
    return this.analysisTaskService.result(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取分析任务详情' })
  @ApiOkResponse({ type: AnalysisTaskEntity })
  @Permissions('project:analysisTask:query')
  findOne(@Param('id') id: number) {
    return this.analysisTaskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新分析任务' })
  @ApiOkResponse({ type: AnalysisTaskEntity })
  @Permissions('project:analysisTask:update')
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
