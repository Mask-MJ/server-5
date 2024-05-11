import { PartialType } from '@nestjs/swagger';

export class CreateDictDataDto {}

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {}
