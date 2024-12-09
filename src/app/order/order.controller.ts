import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Patch('update')
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.updateOrder(updateOrderDto);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getOrdersByUserId(userId);
  }
}
