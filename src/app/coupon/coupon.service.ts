import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/coupon.entity';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/createCoupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async createCoupon(data: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponRepository.create(data); // Tạo coupon từ DTO
    return this.couponRepository.save(coupon); // Lưu vào cơ sở dữ liệu
  }

  async getCouponByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code, isActive: true },
    });
    if (!coupon) {
      throw new NotFoundException(
        `Coupon with code "${code}" not found or inactive`,
      );
    }
    return coupon;
  }

  async deactivateCoupon(couponId: string): Promise<void> {
    const coupon = await this.couponRepository.findOne({ where: { couponId } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    coupon.isActive = false;
    await this.couponRepository.save(coupon);
  }
}
