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
import { FactoryService } from './factory.service';
import {
  CreateFactoryDto,
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
  remove(@Param('id') id: number) {
    return this.factoryService.remove(id);
  }
}
