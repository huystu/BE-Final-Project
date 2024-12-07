import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { Address } from 'src/entities/address.entity';
import { Coupon } from 'src/entities/coupon.entity';
import { CartTransaction } from 'src/entities/cartTransaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Address, Coupon, CartTransaction]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
