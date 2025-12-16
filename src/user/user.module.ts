import { Module } from '@nestjs/common';
import { UserService } from './app/user.service';
import { UserController } from './interface/user.controller';
import { UserEntity } from './infra/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
