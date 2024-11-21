/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
  Min,
  ArrayMinSize,
} from 'class-validator';

//ProductInfoDto được sử dụng để validate cấu trúc của trường info trong Product entity.
export class ProductInfoDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({})
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  color: string[];

  @ApiProperty({})
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  size: string[];

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  policy: string;
}

export class CreateProductDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({})
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({})
  @IsObject()
  @ValidateNested()
  @Type(() => ProductInfoDto)
  info: ProductInfoDto;

  @ApiProperty({})
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({})
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
