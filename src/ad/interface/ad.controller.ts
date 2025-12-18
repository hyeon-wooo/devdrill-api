import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdService } from '../app/ad.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { sendSuccessRes } from 'src/common/generateResponse';
import { Request, Response } from 'express';
import { EAdEventType } from '../domain/ad.enum';

@Controller('ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  private readonly logger = new Logger(AdController.name);

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async watchAd(
    @Req() { user }: Request,
    @Body() body: { eventType: EAdEventType },
    @Res() res: Response,
  ) {
    const userId = user?.id ?? 0;
    if (!userId) this.logger.warn('User ID is required');

    res.json(sendSuccessRes(true));

    await this.adService.createAdHistory(userId, body.eventType);

    return;
  }
}
