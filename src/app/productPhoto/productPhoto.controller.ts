import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductPhotoService } from './productPhoto.service';

@Controller('productPhoto')
export class ProductPhotoController {
  constructor(private readonly productPhotoService: ProductPhotoService) {}

  // Upload và lưu ảnh (nhận productId từ body)
  @Delete(':id')
  async deletePhotoById(@Param('id') id: string) {
    const photos = await this.productPhotoService.removePhotoById(id);

    return {
      message: 'Photo deleted and saved successfully',
      photos,
    };
  }
}
