import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {


  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Old password must be at least 8 characters long' })
  oldPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}
