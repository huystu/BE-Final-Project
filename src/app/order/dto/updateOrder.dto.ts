import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { MethodShippingEnum, OrderStatus } from 'src/entities/order.entity';

export class UpdateOrderDto {
  @IsUUID()
  @ApiProperty({ description: 'ID của đơn hàng cần cập nhật' })
  orderId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty({ description: 'Trạng thái đơn hàng' })
  status?: OrderStatus;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'ID địa chỉ giao hàng mới' })
  addressId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: 'ID mã giảm giá mới' })
  couponId?: string;

  @IsOptional()
  @IsEnum(MethodShippingEnum)
  @ApiProperty({ description: 'Phương thức vận chuyển mới' })
  methodShipping?: MethodShippingEnum;
}
