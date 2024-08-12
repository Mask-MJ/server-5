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
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  QueryContractDto,
  UpdateContractDto,
} from './contract.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ContractEntity } from './contract.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';

@ApiTags('合同管理')
@ApiBearerAuth('bearer')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: '创建合同' })
  @ApiCreatedResponse({ type: ContractEntity })
  @Permissions('project:contract:create')
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractService.create(user, createContractDto);
  }

  @Get()
  @ApiOperation({ summary: '获取合同列表' })
  @ApiPaginatedResponse(ContractEntity)
  @Permissions('project:contract:query')
  findAll(@Query() queryContractDto: QueryContractDto) {
    return this.contractService.findAll(queryContractDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取合同信息' })
  @ApiOkResponse({ type: ContractEntity })
  @Permissions('project:contract:query')
  findOne(@Param('id') id: number) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新合同信息' })
  @ApiOkResponse({ type: ContractEntity })
  @Permissions('project:contract:update')
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(id, user, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除合同' })
  @Permissions('project:contract:delete')
  remove(@Param('id') id: number) {
    return this.contractService.remove(id);
  }
}
