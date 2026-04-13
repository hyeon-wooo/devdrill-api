import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandService } from '../app/command.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { sendSuccessRes } from 'src/common/generateResponse';
import { ECommandMastery } from '../domain/command.enum';
import { SessionId } from 'src/log/app/session-id.decorator';

@Controller('command')
export class CommandController {
  constructor(private readonly service: CommandService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getList(@Req() { user }: Request, @Query('techId') techId: string) {
    const userId = user!.id;
    const result = await this.service.getList(
      userId,
      user?.canReadAll ?? false,
      Number(techId) || undefined,
    );
    return sendSuccessRes(result);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getDetail(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @SessionId() sessionId: string,
  ) {
    const userId = user!.id;
    const result = await this.service.getDetail(
      Number(idStr),
      userId,
      sessionId,
    );
    return sendSuccessRes(result);
  }

  @Post('/:id/bookmark')
  @UseGuards(JwtAuthGuard)
  async bookmark(@Param('id') idStr: string, @Req() { user }: Request) {
    const userId = user!.id;
    const result = await this.service.bookmark(Number(idStr), userId);
    return sendSuccessRes({ bookmarked: result });
  }

  @Post('/:id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') idStr: string, @Req() { user }: Request) {
    const userId = user!.id;
    const result = await this.service.like(Number(idStr), userId);
    return sendSuccessRes({ liked: result });
  }

  @Patch('/:id/mastery')
  @UseGuards(JwtAuthGuard)
  async updateMastery(
    @Param('id') idStr: string,
    @Req() { user }: Request,
    @Body() body: { mastery: ECommandMastery },
  ) {
    const userId = user!.id;
    await this.service.updateMastery(Number(idStr), userId, body.mastery);
    return sendSuccessRes(true);
  }
}
