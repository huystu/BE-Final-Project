import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Old password must be at least 8 characters long' })
  oldPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 8 characters long' })
  newPassword: string;
}
