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
import { FactoryService } from './factory.service';
import {
  CreateFactoryDto,
  importDto,
  QueryFactoryDto,
  UpdateFactoryDto,
} from './factory.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FactoryEntity } from './factory.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpRequest } from 'express';

@ApiTags('工厂管理')
@ApiBearerAuth('bearer')
@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Post()
  @ApiOperation({ summary: '创建工厂' })
  @ApiCreatedResponse({ type: FactoryEntity })
  @Permissions('project:factory:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createFactoryDto: CreateFactoryDto,
  ) {
    return this.factoryService.create(user, createFactoryDto);
  }
  @Get()
  @ApiOperation({ summary: '获取工厂列表' })
  @ApiPaginatedResponse(FactoryEntity)
  @Permissions('project:factory:query')
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryFactoryDto: QueryFactoryDto,
  ) {
    return this.factoryService.findAll(user, queryFactoryDto);
  }

  @Post('import')
  @ApiOperation({ summary: '导入阀门数据' })
  @UseInterceptors(FileInterceptor('file'))
  import(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: importDto,
  ) {
    return this.factoryService.import(user, file, body);
  }

  @Get('chart/:id')
  @ApiOperation({ summary: '获取工厂工作台详情' })
  @ApiOkResponse({ type: FactoryEntity })
  @Permissions('project:factory:query')
  findChartOne(@Param('id') id: number) {
    return this.factoryService.findChartOne(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取工厂详情' })
  @ApiOkResponse({ type: FactoryEntity })
  @Permissions('project:factory:query')
  findOne(@Param('id') id: number) {
    return this.factoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新工厂' })
  @ApiOkResponse({ type: FactoryEntity })
  @Permissions('project:factory:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateFactoryDto: UpdateFactoryDto,
  ) {
    return this.factoryService.update(id, user, updateFactoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除工厂' })
  @Permissions('project:factory:delete')
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Request() request: ExpRequest,
    @Headers('X-Real-IP') ip: string,
  ) {
    return this.factoryService.remove(user, id, ip || request.ip);
  }
}
