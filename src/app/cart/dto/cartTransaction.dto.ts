import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateCartTransactionDto {
  @IsUUID()
  @ApiProperty({})
  cartId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({})
  action: string;

  
}
