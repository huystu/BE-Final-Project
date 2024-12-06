/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({})
  @IsUUID()
  userId: string; 

  @ApiProperty({})
  @IsNumber()
  rating: number;

  @ApiProperty({})
  @IsString()
  comment: string;
}
