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
  const { createdAt, updatedAt, contractTime, children } = data;

  createdAt &&
    (data.createdAt = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss'));
  updatedAt &&
    (data.updatedAt = dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss'));
  contractTime &&
    (data.contractTime = dayjs(contractTime).format('YYYY-MM-DD'));
  children && (data.children = children.map((item: any) => changeTime(item)));

  return data;
}
