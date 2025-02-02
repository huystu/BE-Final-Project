import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({})
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  phone: number;
}
