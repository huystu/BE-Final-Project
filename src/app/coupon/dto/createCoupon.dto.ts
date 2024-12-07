import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string; // Mã giảm giá (bắt buộc)

  @IsNumber()
  @IsNotEmpty()
  discountPercent: number; // Tỷ lệ giảm giá (bắt buộc)

  @IsOptional()
  @IsDateString()
  expirationDate?: Date; // Ngày hết hạn (tùy chọn)
}
