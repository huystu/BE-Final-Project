import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UploadService } from './upload.service';
  
  @Controller('upload')
  export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
  
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('File is required');
      }
  
      const result = await this.uploadService.uploadImageToCloudinary(file);
      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: file.size,
      };
    }
  }
  