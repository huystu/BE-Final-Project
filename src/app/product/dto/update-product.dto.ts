/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
@IsOptional()
@IsBoolean()
isDelete?: boolean;
}