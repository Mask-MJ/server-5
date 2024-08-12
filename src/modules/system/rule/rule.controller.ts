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
import { FileInterceptor } from '@nestjs/platform-express';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { uploadDto } from 'src/common/dto/base.dto';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';

@ApiTags('规则管理')
@ApiBearerAuth('bearer')
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @ApiOperation({ summary: '创建规则' })
  @ApiCreatedResponse({ type: RuleEntity })
  @Permissions('system:rule:create')
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.create(createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: '获取规则列表' })
  @ApiPaginatedResponse(RuleEntity)
  @Permissions('system:rule:query')
  findAll(@Query() queryRuleDto: QueryRuleDto) {
    return this.ruleService.findAll(queryRuleDto);
  }

  @Post('upload')
  @ApiOperation({ summary: '上传规则文件' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @ActiveUser() user: ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: uploadDto,
  ) {
    return this.ruleService.upload(user, file, body);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取规则详情' })
  @ApiOkResponse({ type: RuleEntity })
  @Permissions('system:rule:query')
  findOne(@Param('id') id: number) {
    return this.ruleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新规则' })
  @ApiOkResponse({ type: RuleEntity })
  @Permissions('system:rule:update')
  update(@Param('id') id: number, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(id, updateRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除规则' })
  @Permissions('system:rule:delete')
  remove(@Param('id') id: number) {
    return this.ruleService.remove(id);
  }
}
