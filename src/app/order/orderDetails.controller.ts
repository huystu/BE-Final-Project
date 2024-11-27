import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { OrderDetailsService } from './orderDetails.service';
import { CreateOrderDetailsDto } from './dto/createOrderDetails.dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  async createOrderDetails(
    @Body() createOrderDetailsDto: CreateOrderDetailsDto,
  ) {
    return await this.orderDetailsService.createOrderDetails(
      createOrderDetailsDto,
    );
  }

  @Get(':cartId')
  async getOrderDetailsByCart(@Param('cartId') id: string) {
    return await this.orderDetailsService.getOrderDetailsByCart(id);
  }

  @Delete(':id')
  async deleteOrderDetails(@Param('id') id: string) {
    await this.orderDetailsService.deleteOrderDetails(id);
    return { message: 'Order details deleted successfully' };
  }
}
