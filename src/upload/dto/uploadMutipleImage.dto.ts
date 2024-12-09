import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadMultipleImagesDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Mô tả cho các hình ảnh', required: false })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Thẻ hoặc danh mục gắn liền với hình ảnh',
    required: false,
  })
  tags?: string;
}
