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
import { DictDataTreeService } from './dict-data-tree.service';
import {
  CreateDictDataTreeDto,
  QueryDictDataTreeDto,
  UpdateDictDataTreeDto,
} from './dict-data-tree.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DictDataTreeEntity } from './dict-data-tree.entity';

@ApiTags('pdf数据树管理')
@ApiBearerAuth('bearer')
@Controller('dict-data-tree')
export class DictDataTreeController {
  constructor(private readonly dictDataTreeService: DictDataTreeService) {}

  @Post()
  @ApiOperation({ summary: '创建pdf数据树' })
  @ApiCreatedResponse({ type: DictDataTreeEntity })
  create(@Body() createDictDataTreeDto: CreateDictDataTreeDto) {
    return this.dictDataTreeService.create(createDictDataTreeDto);
  }

  @Get()
  @ApiOperation({ summary: '获取pdf数据树列表' })
  @ApiOkResponse({ type: DictDataTreeEntity, isArray: true })
  findAll(@Query() queryDictDataTreeDto: QueryDictDataTreeDto) {
    return this.dictDataTreeService.findAll(queryDictDataTreeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取pdf数据树详情' })
  @ApiOkResponse({ type: DictDataTreeEntity })
  findOne(@Param('id') id: number) {
    return this.dictDataTreeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新pdf数据树' })
  @ApiOkResponse({ type: DictDataTreeEntity })
  update(
    @Param('id') id: number,
    @Body() updateDictDataTreeDto: UpdateDictDataTreeDto,
  ) {
    return this.dictDataTreeService.update(id, updateDictDataTreeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除pdf数据树' })
  remove(@Param('id') id: number) {
    return this.dictDataTreeService.remove(id);
  }
}
