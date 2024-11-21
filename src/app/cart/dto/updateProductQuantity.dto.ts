import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class UpdateProductQuantityDto {
  @IsUUID()
  @ApiProperty({})
  productId: string;

  @IsInt()
  @Min(0)
  @ApiProperty({})
  quantity: number;

 
}
