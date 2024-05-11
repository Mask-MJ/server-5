import { PartialType } from '@nestjs/swagger';

export class CreateDictTypeDto {}

export class UpdateDictTypeDto extends PartialType(CreateDictTypeDto) {}
