import { Module } from '@nestjs/common';
import { NoticeController } from './interface/notice.controller';
import { NoticeService } from './app/notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './infra/notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity])],
  controllers: [NoticeController],
  providers: [NoticeService]
})
export class NoticeModule {}
