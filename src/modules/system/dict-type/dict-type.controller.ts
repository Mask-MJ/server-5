import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DictTypeService } from './dict-type.service';
import { CreateDictTypeDto, UpdateDictTypeDto } from './dict-type.dto';

@Controller('dict-type')
export class DictTypeController {
  constructor(private readonly dictTypeService: DictTypeService) {}

  @Post()
  create(@Body() createDictTypeDto: CreateDictTypeDto) {
    return this.dictTypeService.create(createDictTypeDto);
  }

  @Get()
  findAll() {
    return this.dictTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dictTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDictTypeDto: UpdateDictTypeDto,
  ) {
    return this.dictTypeService.update(+id, updateDictTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dictTypeService.remove(+id);
  }
}
