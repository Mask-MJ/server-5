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
import { RuleService } from './rule.service';
import { CreateRuleDto, UpdateRuleDto, QueryRuleDto } from './rule.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RuleEntity } from './rule.entity';

@ApiTags('规则管理')
@ApiBearerAuth('bearer')
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @ApiOperation({ summary: '创建规则' })
  @ApiCreatedResponse({ type: RuleEntity })
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.create(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取规则列表' })
  @ApiOkResponse({ type: RuleEntity, isArray: true })
  findAll(@Query() queryRuleDto: QueryRuleDto) {
    return this.ruleService.findAll(queryRuleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ruleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(id, updateRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ruleService.remove(id);
  }
}
