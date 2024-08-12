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
import { UnitService } from './unit.service';
import { CreateUnitDto, UpdateUnitDto, QueryUnitDto } from './unit.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UnitEntity } from './unit.entity';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';

@ApiTags('单位管理')
@ApiBearerAuth('bearer')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: '创建单位' })
  @ApiCreatedResponse({ type: UnitEntity })
  @Permissions('system:unit:create')
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: '获取单位列表' })
  @ApiPaginatedResponse(UnitEntity)
  @Permissions('system:unit:query')
  findAll(@Query() queryUnitDto: QueryUnitDto) {
    return this.unitService.findAll(queryUnitDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单位详情' })
  @ApiOkResponse({ type: UnitEntity })
  @Permissions('system:unit:query')
  findOne(@Param('id') id: number) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新单位' })
  @ApiOkResponse({ type: UnitEntity })
  @Permissions('system:unit:update')
  update(@Param('id') id: number, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除单位' })
  @Permissions('system:unit:delete')
  remove(@Param('id') id: number) {
    return this.unitService.remove(id);
  }
}
