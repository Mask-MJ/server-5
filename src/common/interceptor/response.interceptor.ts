import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { Observable, map } from 'rxjs';

interface Result {
  rows?: any;
  page?: number;
  pageSize?: number;
  total?: number;
}

export class TransformerPagination<T = unknown> {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
}
export interface IRes<T = unknown> {
  code: number;
  error?: string;
  data: T;
}

@Injectable()
export class FormatResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let res: Result = Array.isArray(data)
          ? data.map((item) => changeTime(item))
          : changeTime(data);
        if (data?.rows) {
          res = {
            rows: data.rows.map((item: any) => changeTime(item)),
            page: data.currentPage,
            pageSize: data.pageCount,
            total: data.totalCount,
          };
        }
        return res;
      }),
    );
  }
}

function changeTime(data: any) {
  if (!data) return [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'children' && Array.isArray(data[key])) {
        data[key] = data[key].map((item: any) => changeTime(item));
      }
      if (data[key] instanceof Date) {
        data[key] = dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }

  return data;
}
