import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DictDataService } from './dict-data.service';
import { CreateDictDataDto, UpdateDictDataDto } from './dict-data.dto';

@Controller('dict-data')
export class DictDataController {
  constructor(private readonly dictDataService: DictDataService) {}

  @Post()
  create(@Body() createDictDatumDto: CreateDictDataDto) {
    return this.dictDataService.create(createDictDatumDto);
  }

  @Get()
  findAll() {
    return this.dictDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.dictDataService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDictDatumDto: UpdateDictDataDto,
  ) {
    return this.dictDataService.update(id, updateDictDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.dictDataService.remove(id);
  }
}
