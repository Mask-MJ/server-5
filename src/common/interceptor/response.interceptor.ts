import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Observable, map } from 'rxjs';
import { Request } from 'express';

interface Result {
  code: number;
  message: string;
  data: any;
  page?: number;
  pageSize?: number;
  total?: number;
}

@Injectable()
export class FormatResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Request>();
    return next.handle().pipe(
      map((data) => {
        const res: Result = {
          code: response.statusCode,
          message: 'success',
          data: Array.isArray(data)
            ? data.map((item) => changeTime(item))
            : changeTime(data),
        };
        if (data?.rows) {
          res.data = data.rows.map((item: any) => changeTime(item));
          res.page = data.currentPage;
          res.pageSize = data.pageCount;
          res.total = data.totalCount;
        }
        return res;
      }),
    );
  }
}

function changeTime(data: any) {
  if (!data) return [];
  const { createdAt, updatedAt, children } = data;

  createdAt &&
    (data.createdAt = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'));
  updatedAt &&
    (data.updatedAt = dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'));
  children && (data.children = children.map((item: any) => changeTime(item)));

  return data;
}
