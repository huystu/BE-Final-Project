/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsObject,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
  Min,
  ArrayMinSize,
  IsArray,
  IsOptional,
} from 'class-validator';
import { CreateVariantDto } from 'src/app/variant/dto/create-variant.dto';

// DTO cho thông tin chi tiết sản phẩm
export class ProductInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Chính sách đổi trả hoặc bảo hành',
  })
  @IsString()
  @IsNotEmpty()
  policy: string;
}

// DTO chính cho tạo sản phẩm
export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Giá của sản phẩm',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Ít nhất phải có một URL ảnh.' })
  @IsString({ each: true })
  urls: string[];

  @ApiProperty({
    description: 'Thông tin chi tiết sản phẩm',
    type: ProductInfoDto,
  })
  @IsString()
  // @ValidateNested()
  @Type(() => ProductInfoDto)
  info: ProductInfoDto;

  @ApiProperty({
    description: 'Số lượng sản phẩm trong kho',
  })
  @IsNumber()
  @Min(0, { message: 'Số lượng phải lớn hơn hoặc bằng 0.' })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'ID của danh mục sản phẩm',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Danh sách các biến thể sản phẩm (ví dụ: màu sắc, kích thước)',
    type: [CreateVariantDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất một biến thể sản phẩm.' })
  // @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
