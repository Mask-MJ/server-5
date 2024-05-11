import { PartialType, IntersectionType, PickType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateOperationLogDto {
  @IsString()
  title: string;

  @IsString()
  account: string;

  @IsNumber()
  businessType: number;

  @IsString()
  module: string;

  @IsString()
  ip: string;

  @IsString()
  address: string;
}

export class QueryOperationLogDto extends PartialType(
  IntersectionType(
    PickType(CreateOperationLogDto, ['account', 'businessType', 'module']),
    BaseDto,
  ),
) {}
