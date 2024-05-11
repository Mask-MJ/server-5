import { PartialType } from '@nestjs/swagger';

export class CreateDeviceDto {}
export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
