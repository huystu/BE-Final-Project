import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { Coupon } from 'src/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])], // Đăng ký entity Coupon
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
