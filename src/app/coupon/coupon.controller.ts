import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { Coupon } from 'src/entities/coupon.entity';
import { CreateCouponDto } from './dto/createCoupon.dto';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Get(':code')
  async getCoupon(@Param('code') code: string): Promise<Coupon> {
    return this.couponService.getCouponByCode(code);
  }

  @Patch(':id/deactivate')
  async deactivateCoupon(@Param('id') id: string): Promise<void> {
    await this.couponService.deactivateCoupon(id);
  }
}
