import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FotgetPasswordDTO {
  @IsEmail()
  @ApiProperty({})
  email: string;
}
