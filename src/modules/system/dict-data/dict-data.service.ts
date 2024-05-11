import { Injectable } from '@nestjs/common';
import { CreateDictDataDto, UpdateDictDataDto } from './dict-data.dto';

@Injectable()
export class DictDataService {
  create(createDictDataDto: CreateDictDataDto) {
    return 'This action adds a new dictDatum';
  }

  findAll() {
    return `This action returns all dictData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dictDatum`;
  }

  update(id: number, updateDictDataDto: UpdateDictDataDto) {
    return `This action updates a #${id} dictDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictDatum`;
  }
}
