import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateLoginLogDto {
  @IsString()
  sessionId: string;

  @IsString()
  account: string;

  @IsString()
  ip: string;

  @IsString()
  address: string;
}

export class QueryLoginDto extends PartialType(
  IntersectionType(PickType(CreateLoginLogDto, ['account']), BaseDto),
) {}
