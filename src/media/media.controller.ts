import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { extname } from 'path';
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png'];


@Controller('media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Apenas JPG e PNG são aceitos'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Envie um arquivo no campo "file"');
    }
    return { filename: file.filename, size: file.size };
  }
}
