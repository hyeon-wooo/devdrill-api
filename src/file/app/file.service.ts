import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CRUDService } from 'src/common/crud.service';
import { Repository } from 'typeorm';
import { FileEntity } from '../infra/file.entity';
import { EFileUsage } from '../domain/enum';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class FileService extends CRUDService<FileEntity> {
  private readonly filePublicStorage: string;
  constructor(
    @InjectRepository(FileEntity) repo: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    super(repo);

    this.filePublicStorage = this.configService.get('FILE_PUBLIC_STORAGE')!;
  }

  async saveUploadedFile(params: {
    usage: EFileUsage;
    originalName: string;
    filename: string;
    size: number;
    relativePath: string;
  }) {
    const saved = await this.create({
      usage: params.usage,
      originalName: params.originalName,
      fileSize: params.size,
      pathOrigin: path.join('public', params.filename),
    });

    return saved[0];
  }
}
