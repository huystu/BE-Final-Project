import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({})
  username?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  fullName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({})
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  address?: string;

  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({})
  phone?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  description?: string;
}
