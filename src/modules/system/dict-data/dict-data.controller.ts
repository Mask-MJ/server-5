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
import { DictDataService } from './dict-data.service';
import {
  CreateDictDataDto,
  QueryDictDataDto,
  UpdateDictDataDto,
} from './dict-data.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { DictDataEntity } from './dict-data.entity';
@ApiTags('字典数据管理')
@ApiBearerAuth('bearer')
@Controller('dict-data')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post()
  @ApiOperation({ summary: '创建字典数据' })
  @ApiCreatedResponse({ type: DictDataEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictDataDto: CreateDictDataDto,
  ) {
    return this.dictDataService.create(user, createDictDataDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典数据列表' })
  @ApiOkResponse({ type: DictDataEntity, isArray: true })
  findAll(@Query() queryDictDataDto: QueryDictDataDto) {
    return this.dictDataService.findAll(queryDictDataDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典数据详情' })
  @ApiOkResponse({ type: DictDataEntity })
  findOne(@Param('id') id: number) {
    return this.dictDataService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新字典数据' })
  @ApiOkResponse({ type: DictDataEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictDataDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(id, user, updateDictDataDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典数据' })
  remove(@Param('id') id: number) {
    return this.dictDataService.remove(id);
  }
}
