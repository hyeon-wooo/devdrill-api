import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LogService } from './app/log.service';
import { SessionId } from './app/session-id.decorator';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';
import { JwtPassGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Controller('log')
export class LogController {
    constructor(private readonly service: LogService) {}

    @Post('/screen')
    @UseGuards(JwtPassGuard)
    async createScreenLog(@Body() body: {screenName: string, params: string}, @SessionId() sessionId: string, @Req() { user }: Request) {
        if (!sessionId) return sendFailRes('세션 ID가 없습니다.');
        this.service.createScreenLog(sessionId, body.screenName, body.params, user?.id ?? null);
        
        return sendSuccessRes(true)
    }
}
