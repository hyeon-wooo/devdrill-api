import { Module } from '@nestjs/common';
import { FileController } from './interface/file.controller';
import { FileService } from './app/file.service';
import { FileEntity } from './infra/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
