import { PartialType } from '@nestjs/swagger';
export class CreateContractDto {}

export class UpdateContractDto extends PartialType(CreateContractDto) {}
