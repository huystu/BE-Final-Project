/* eslint-disable prettier/prettier */
import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({})
  @IsString()
  size: string;

  @ApiProperty({})
  @IsString()
  color: string;

  @ApiProperty({})
  @IsNumber()
  price: number;

  @ApiProperty({})
  @IsNumber()
  quantity: number;
}
