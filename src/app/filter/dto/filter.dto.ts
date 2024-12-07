/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
export class FilterDto {
    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    search?: string;
    
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    maxPrice?: number;
    
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    page?: number;
    
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    limit?: number;
    
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    take?: number;

    @ApiProperty({required: false})
    @IsOptional()
    @IsIn(['ASC', 'DESC'], { message: 'OrderBy phải là ASC hoặc DESC' })
    orderBy?: 'ASC' | 'DESC';
    
    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    @IsUUID()
    categoryId?: string;

    // @ApiProperty({required: false})
    // @IsOptional()
    // @IsString()
    // brandId?: string;

}