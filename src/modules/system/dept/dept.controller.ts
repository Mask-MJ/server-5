import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto, UpdateDeptDto } from './dept.dto';

@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @Get()
  findAll() {
    return this.deptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(id, updateDeptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.deptService.remove(id);
  }
}
