import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateOrderDetailsDto {
  @ApiProperty({})
  @IsInt()
  cartId: string;
  
  @ApiProperty({})
  @IsInt()
  productId: number;
  
  @ApiProperty({})
  @IsString()
  productName: string;
  
  @IsNumber()
  price: number;
 
  @ApiProperty({})
  @IsInt()
  quantity: number;
}
