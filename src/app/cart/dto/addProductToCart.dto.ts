import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductToCartDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID của người dùng' })
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID của sản phẩm cần thêm vào giỏ hàng' })
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' })
  @ApiProperty({ description: 'Số lượng sản phẩm cần thêm' })
  quantity: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Giảm giá (tuỳ chọn)' })
  discount?: number;
}
