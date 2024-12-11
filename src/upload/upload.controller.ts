import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadMultipleImagesDto } from './dto/uploadMutipleImage.dto';

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

  @Post('mutipleImage')
  @UseInterceptors(FilesInterceptor('files', 5)) // Cho phép upload tối đa 10 file
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata: UploadMultipleImagesDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    
    const results =
      await this.uploadService.uploadMultipleImagesToCloudinary(files);

    return {
      message: 'Files uploaded successfully',
      metadata,
      files: results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      })),
    };
  }
}
