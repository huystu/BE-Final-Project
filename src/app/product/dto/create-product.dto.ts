/* eslint-disable prettier/prettier */
import { IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsObject,
  IsUUID,
  IsNotEmpty,
  Min,
  ArrayMinSize,
  IsArray,
  IsEnum,
} from 'class-validator';

export enum Color {
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
  Yellow = 'Yellow',
  Black = 'Black',
  White = 'White',
  Gray = 'Gray',
  Brown = 'Brown',
  Pink = 'Pink',
  Purple = 'Purple',
  Orange = 'Orange',
  Gold = 'Gold',
  Silver = 'Silver',
}
// DTO cho thông tin chi tiết sản phẩm
export class ProductInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
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
    description: 'Chi tiết sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @ApiProperty({})
  @IsArray()
  size: string[];

  @ApiProperty({ enum: Color, isArray: true })
  @IsEnum(Color, { each: true })
  @IsArray()
  color: Color[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  @IsArray()
  // @ArrayMinSize(1, { message: 'Ít nhất phải có một URL ảnh.' })
  // @IsString({ each: true })
  urls: string[];

  // @ApiProperty({
  //   description: 'Thông tin chi tiết sản phẩm',
  //   type: ProductInfoDto,
  // })
  // @Type(() => ProductInfoDto)
  // info: ProductInfoDto;

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
  // @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  //@IsUUID()
  @IsOptional()
  brandId: string;
}
