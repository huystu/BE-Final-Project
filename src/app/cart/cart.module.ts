import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { User } from 'src/entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product } from 'src/entities/product.entity';
import { CartTransaction } from 'src/entities/cartTransaction.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, User, Product, CartTransaction]),
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
