import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import dayjs from 'dayjs';

export class PaginateDto {
  /**
   * 页码
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  /**
   * 每页数量
   * @example 10
   */
  @IsNumber()
  @Type(() => Number)
  pageSize: number = 10;
}

export class TimeDto {
  /**
   * 开始时间
   * @example 1714752000000
   */
  @Type(() => Number)
  @Transform(({ value }) => dayjs(value).format(), { toClassOnly: true })
  beginTime: Date;

  /**
   * 结束时间
   * @example 1716048000000
   */
  @Type(() => Number)
  @Transform(({ value }) => dayjs(value).format(), { toClassOnly: true })
  endTime: Date;
}

export class BaseDto extends IntersectionType(PaginateDto, TimeDto) {}
