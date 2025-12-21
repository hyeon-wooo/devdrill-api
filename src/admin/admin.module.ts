import { Module } from '@nestjs/common';
import { AdminController } from './interface/admin.controller';
import { AdminService } from './app/admin.service';
import { AdminEntity } from './infra/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), AuthModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
