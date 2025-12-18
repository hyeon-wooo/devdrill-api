import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from '../app/push.service';
import { sendSuccessRes } from 'src/common/generateResponse';

@Controller('notification')
export class NotificationController {
  constructor(private readonly pushService: PushService) {}

  //   @Post('/push')
  //   async push(@Body() body: { tokens: string[]; title: string; body: string }) {
  //     await this.pushService.sendToDevices(body.tokens, body.title, body.body);
  //     return sendSuccessRes(null);
  //   }
}
