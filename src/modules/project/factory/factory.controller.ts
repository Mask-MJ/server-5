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
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { FactoryEntity, FactoryTreeEntity } from './factory.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('工厂管理')
@ApiBearerAuth('bearer')
@Controller('factory')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Post()
  @ApiOperation({ summary: '创建工厂' })
  @ApiCreatedResponse({ type: FactoryEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createFactoryDto: CreateFactoryDto,
  ) {
    return this.factoryService.create(user, createFactoryDto);
  }
  @Get()
  @ApiOperation({ summary: '获取工厂列表' })
  @ApiOkResponse({ type: FactoryTreeEntity, isArray: true })
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryFactoryDto: QueryFactoryDto,
  ) {
    return this.factoryService.findAll(user, queryFactoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.factoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateFactoryDto: UpdateFactoryDto,
  ) {
    return this.factoryService.update(id, user, updateFactoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.factoryService.remove(id);
  }
}
