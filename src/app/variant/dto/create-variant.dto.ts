/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


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
  Platinum = 'Platinum',
  Diamond = 'Diamond',
  Ruby = 'Ruby',
}
export class CreateVariantDto {
  @ApiProperty({})
  @IsString()
  size: string;

  @ApiProperty({
    enum: Color,
  })
  @IsEnum(Color)
  color: Color

  @ApiProperty({})
  @IsNumber()
  price: number;

  @ApiProperty({})
  @IsNumber()
  quantity: number;
}
