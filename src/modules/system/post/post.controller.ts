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
import { PostService } from './post.service';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './post.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PostEntity } from './post.entity';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('岗位管理')
@ApiBearerAuth('bearer')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: '创建岗位' })
  @ApiCreatedResponse({ type: PostEntity })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.create(user, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取岗位列表' })
  @ApiOkResponse({ type: PostEntity, isArray: true })
  findAll(@Query() queryPostDto: QueryPostDto) {
    return this.postService.findAll(queryPostDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取岗位详情' })
  @ApiOkResponse({ type: PostEntity })
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新岗位' })
  @ApiOkResponse({ type: PostEntity })
  update(
    @Param('id') id: number,
    @ActiveUser() user: ActiveUserData,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, user, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除岗位' })
  remove(@Param('id') id: number) {
    return this.postService.remove(id);
  }
}
