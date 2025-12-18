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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DBConfigService,
    }),
    UserModule,
    QuestionModule,
    CategoryModule,
    NotificationModule,
    AdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
