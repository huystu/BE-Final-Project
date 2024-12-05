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
} from 'class-validator';
import { CreateVariantDto } from 'src/app/variant/dto/create-variant.dto';

export class ProductInfoDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  description: string;

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
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  urls: string[];

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

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
