import { PartialType } from '@nestjs/swagger';
export class CreateMenuDto {}

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
