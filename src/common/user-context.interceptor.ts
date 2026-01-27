import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { trace } from '@opentelemetry/api';

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userId = user?.id ?? 'guest';
    const sessionId = request.headers['x-session-id'] ?? 'no-session';

    // 로그에 속성 추가
    if (request.log)
      request.log.child({
        user_id: userId,
        session_id: sessionId,
      });

    const currentSpan = trace.getActiveSpan();
    if (currentSpan) {
      currentSpan.setAttribute('user_id', userId);
      currentSpan.setAttribute('session_id', sessionId);
    }

    return next.handle();
  }
}
