import { Module } from '@nestjs/common';
import { NotificationService } from './app/notification.service';
import { NotificationController } from './interface/notification.controller';
import { PushService } from './app/push.service';

@Module({
  providers: [NotificationService, PushService],
  controllers: [NotificationController],
  exports: [PushService],
})
export class NotificationModule {}
