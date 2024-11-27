import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from 'src/entities/orderDetails.entity'; 
import { Cart } from 'src/entities/cart.entity'; 
import { OrderDetailsService } from './orderDetails.service';
import { OrderDetailsController } from './orderDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetails, Cart])],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
})
export class OrderDetailsModule {}
