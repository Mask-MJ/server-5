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

@ApiTags('单位管理')
@ApiBearerAuth('bearer')
@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: '创建单位' })
  @ApiCreatedResponse({ type: UnitEntity })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: '获取单位列表' })
  @ApiOkResponse({ type: UnitEntity, isArray: true })
  findAll(@Query() queryUnitDto: QueryUnitDto) {
    return this.unitService.findAll(queryUnitDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.unitService.remove(id);
  }
}
