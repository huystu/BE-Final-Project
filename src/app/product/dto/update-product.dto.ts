/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  price?: number;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(0, { message: 'Quantity must be at least 0' })
  quantity?: number;
}
