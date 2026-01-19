import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 헤더에서 x-session-id를 추출합니다.
    return request.headers['x-session-id'] ?? null;
  },
);