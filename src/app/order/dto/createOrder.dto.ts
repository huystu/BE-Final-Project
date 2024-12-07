import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  Length,
} from 'class-validator';
import { MethodShippingEnum, OrderStatus } from 'src/entities/order.entity';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string; // ID của người dùng (bắt buộc)

  @IsNotEmpty()
  listProductId: string[];
  

  @IsUUID()
  @IsNotEmpty()
  addressId: string; // ID của địa chỉ giao hàng (bắt buộc)

  @IsUUID()
  @IsOptional()
  couponId?: string; // ID của mã giảm giá (tùy chọn)

  @IsNotEmpty()
  methodShipping: MethodShippingEnum;

  @Optional()
  orderStatus: OrderStatus;

}
