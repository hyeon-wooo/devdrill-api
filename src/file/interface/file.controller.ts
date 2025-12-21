import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../app/file.service';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { ParseFilePipe } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UploadFileBodyDto } from './file.dto';
import { EFileUsage } from '../domain/enum';
import { sendFailRes, sendSuccessRes } from 'src/common/generateResponse';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Get('/')
  async getFiles() {
    const files = await this.service.findAll();
    return sendSuccessRes({
      files,
    });
  }

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles(ERole.ADM)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = process.env.FILE_PUBLIC_STORAGE!;
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, callback) => {
          const fileExt = extname(file.originalname)
            .replace('.', '')
            .toLowerCase();
          const uuidName = require('crypto').randomUUID();
          callback(null, `${uuidName}.${fileExt}`);
        },
      }),
      // limits: { fileSize: 5 * 1024 * 1024 },
      // fileFilter: (_req, file, cb) => {
      //   // if (/^image\/(jpe?g|png|gif|webp)$/i.test(file.mimetype))
      //   // cb(null, true);
      //   // else cb(null, false);
      // },
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: /^image\/(jpe?g|png|gif|webp)$/i }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFileBodyDto,
  ) {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    // const fileExt = extname(file.originalname).replace('.', '').toLowerCase();
    const usage = body.usage || EFileUsage.OTHER;
    const relativePath = `${usage}/${yyyy}/${mm}/${dd}/${file.filename}`;

    const saved = await this.service.saveUploadedFile({
      usage,
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      relativePath,
    });

    return sendSuccessRes({
      id: saved.id,
    });
  }
}
