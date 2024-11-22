/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({})
  @IsOptional()
  @IsString()
  @Length(2, 50)
  fullName?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  @Length(10, 200)
  address?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  @Length(10, 15)
  phoneNumber?: string;

  @ApiProperty({})
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  avatar?: string;
}
