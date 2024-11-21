import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsArray, IsOptional, IsNumber } from 'class-validator';

export class AddProductToCartDto {
  @IsArray()
  @IsOptional()
  @ApiProperty({})
  product: Array<string>;

  @IsUUID()
  @ApiProperty({})
  userId: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({})
  discount: number;

}
