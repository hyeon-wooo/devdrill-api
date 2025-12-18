import { Module } from '@nestjs/common';
import { UserService } from './app/user.service';
import { UserController } from './interface/user.controller';
import { UserEntity } from './infra/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FcmHistoryEntity } from './infra/fcm-history.entity';
import { FcmHistoryService } from './app/fcm-history.service';
import { TokenHistoryEntity } from './infra/token-history.entity';
import { TokenHistoryService } from './app/token-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FcmHistoryEntity,
      TokenHistoryEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, FcmHistoryService, TokenHistoryService],
  exports: [UserService],
})
export class UserModule {}
