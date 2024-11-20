/* eslint-disable prettier/prettier */
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
ArrayMinSize 
} from 'class-validator';

//ProductInfoDto được sử dụng để validate cấu trúc của trường info trong Product entity.
export class ProductInfoDto {
@IsString()
@IsNotEmpty()
description: string;

@IsArray()
@IsString({ each: true })
@ArrayMinSize(1)
color: string[];

@IsArray()
@IsString({ each: true })
@ArrayMinSize(1)
size: string[];

@IsString()
@IsNotEmpty()
policy: string;
}

export class CreateProductDto {
@IsString()
@IsNotEmpty()
name: string;

@IsNumber()
@Min(0)
price: number;

@IsObject()
@ValidateNested()
@Type(() => ProductInfoDto)
info: ProductInfoDto;

@IsNumber()
@Min(0)
quantity: number;

@IsUUID()
@IsNotEmpty()
categoryId: string;
}