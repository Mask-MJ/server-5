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
import { DeptService } from './dept.service';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './dept.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DeptEntity } from './dept.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('部门管理')
@ApiBearerAuth('bearer')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @ApiOperation({ summary: '创建部门' })
  @ApiCreatedResponse({ type: DeptEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createDeptDto: CreateDeptDto,
  ) {
    return this.deptService.create(user, createDeptDto);
  }

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  @ApiOkResponse({ type: DeptEntity, isArray: true })
  findAll(@Query() queryDeptDto: QueryDeptDto) {
    return this.deptService.findAll(queryDeptDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取部门详情' })
  @ApiOkResponse({ type: DeptEntity })
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新部门' })
  @ApiOkResponse({ type: DeptEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateDeptDto: UpdateDeptDto,
  ) {
    return this.deptService.update(id, user, updateDeptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  remove(@Param('id') id: number) {
    return this.deptService.remove(id);
  }
}
