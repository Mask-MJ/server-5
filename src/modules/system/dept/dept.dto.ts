import { PartialType } from '@nestjs/swagger';

export class CreateDeptDto {}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {}
