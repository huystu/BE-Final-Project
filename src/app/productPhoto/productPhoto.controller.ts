import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductPhotoService } from './productPhoto.service';

@Controller('productPhoto')
export class ProductPhotoController {
  constructor(private readonly productPhotoService: ProductPhotoService) {}

  // Upload và lưu ảnh (nhận productId từ body)
  @Post()
  @UseInterceptors(FilesInterceptor('files')) // Nhận nhiều file từ frontend
  async uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { productId: string },
  ) {
    const { productId } = body;

    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const photos = await this.productPhotoService.uploadAndSaveMultiplePhotos(
      files,
      productId,
    );

    return {
      message: 'Photos uploaded and saved successfully',
      photos,
    };
  }
}
