import { Controller, Post, Body, Get, Param, Patch, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from 'src/entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enum/role.enum';
import { GetHistoryOrdersDto } from './dto/historyOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  private validateUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Patch('update')
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.updateOrder(updateOrderDto);
  }

  @Get('all')
  @Roles(Role.Admin) // Chỉ admin mới được truy cập
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get('history/:userId')
  async getHistoryOrders(
    @Param() params: GetHistoryOrdersDto, 
  ): Promise<Order[]> {
    return this.orderService.getHistoryOrdersByUserId(params.userId);
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
