import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from 'src/entities/orderDetails.entity'; 
import { Cart } from 'src/entities/cart.entity';  
import { CreateOrderDetailsDto } from './dto/createOrderDetails.dto';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async createOrderDetails(dto: CreateOrderDetailsDto): Promise<OrderDetails> {
    const { cartId, productId, productName, price, quantity } = dto;

    const cart = await this.cartRepository.findOne({
      where: { cartId }, 
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const orderDetails = this.orderDetailsRepository.create({
      productId,
      productName,
      price,
      quantity,
      cart,
    });

    return await this.orderDetailsRepository.save(orderDetails);
  }

  async getOrderDetailsByCart(cartId: string): Promise<OrderDetails[]> {
    return await this.orderDetailsRepository.find({
      where: { cart: { cartId } }, 
      relations: ['cart'],
    });
  }

  async deleteOrderDetails(id: string): Promise<void> {
    await this.orderDetailsRepository.delete(id);
  }
}
