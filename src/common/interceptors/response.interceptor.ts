import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from 'src/common/dto/response-interceptor.dto';

@Injectable()
export class GlobalResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data: any) => {
        const message = data?.message || 'Request Successful';
        if (data?.message) {
          delete data.message;
        }
        return new ResponseDto(true, data, message);
      }),
    );
  }
}
