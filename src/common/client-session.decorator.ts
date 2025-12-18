import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientSession = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // Express 기준
    const sessionId = request.headers['x-session-id'] as string;

    return sessionId || null;
  },
);
