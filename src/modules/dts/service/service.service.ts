import { Injectable } from '@nestjs/common';
import { CreateServiceAppDto } from './service.dto';

@Injectable()
export class ServiceAppService {
  async create(createServiceAppDto: CreateServiceAppDto) {
    console.log(createServiceAppDto);
    return 'success';
  }
}
