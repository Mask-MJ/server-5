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
import { MenuService } from './menu.service';
import { CreateMenuDto, QueryMenuDto, UpdateMenuDto } from './menu.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { MenuEntity } from './menu.entity';

@ApiTags('菜单管理')
@ApiBearerAuth('bearer')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiCreatedResponse({ type: MenuEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    return this.menuService.create(user, createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '获取菜单列表' })
  @ApiOkResponse({ type: MenuEntity, isArray: true })
  findAll(
    @ActiveUser() user: ActiveUserData,
    @Query() queryMenuDto: QueryMenuDto,
  ) {
    return this.menuService.findAll(user, queryMenuDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单详情' })
  @ApiOkResponse({ type: MenuEntity })
  findOne(@Param('id') id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiOkResponse({ type: MenuEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menuService.update(id, user, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  remove(@Param('id') id: number) {
    return this.menuService.remove(id);
  }
}
