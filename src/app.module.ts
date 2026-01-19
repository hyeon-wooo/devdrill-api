import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfigService } from './config/DBConfigService';
import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { CategoryModule } from './category/category.module';
import { NotificationModule } from './notification/notification.module';
import { AdModule } from './ad/ad.module';
import { ShopModule } from './shop/shop.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminModule } from './admin/admin.module';
import * as dotenv from 'dotenv';
import { BatchModule } from './batch/batch.module';
import { ExamModule } from './exam/exam.module';
import { PracticeModule } from './practice/practice.module';
import { QnaModule } from './qna/qna.module';
import { NoticeModule } from './notice/notice.module';
import { LogModule } from './log/log.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: process.env.FILE_PUBLIC_STORAGE,
      serveRoot: '/public',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DBConfigService,
    }),
    BatchModule,
    UserModule,
    QuestionModule,
    CategoryModule,
    NotificationModule,
    AdModule,
    ShopModule,
    FileModule,
    AdminModule,
    ExamModule,
    PracticeModule,
    QnaModule,
    NoticeModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
