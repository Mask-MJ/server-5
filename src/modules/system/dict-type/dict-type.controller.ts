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
import { DictTypeService } from './dict-type.service';
import {
  CreateDictTypeDto,
  QueryDictTypeDto,
  UpdateDictTypeDto,
} from './dict-type.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DictTypeEntity } from './dict-type.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';

@ApiTags('字典管理')
@ApiBearerAuth('bearer')
@Controller('dict-type')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  @Post()
  @ApiOperation({ summary: '创建字典' })
  @ApiCreatedResponse({ type: DictTypeEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDictTypeDto: CreateDictTypeDto,
  ) {
    return this.dictTypeService.create(user, createDictTypeDto);
  }

  @Get()
  @ApiOperation({ summary: '获取字典列表' })
  @ApiPaginatedResponse(DictTypeEntity)
  findAll(@Query() queryDictTypeDto: QueryDictTypeDto) {
    return this.dictTypeService.findAll(queryDictTypeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取字典详情' })
  @ApiOkResponse({ type: DictTypeEntity })
  findOne(@Param('id') id: number) {
    return this.dictTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新字典' })
  @ApiOkResponse({ type: DictTypeEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(id, user, updateDictTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除字典' })
  remove(@Param('id') id: number) {
    return this.dictTypeService.remove(id);
  }
}
