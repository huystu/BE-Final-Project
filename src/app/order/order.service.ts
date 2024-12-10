import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'src/entities/order.entity';
import { In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from 'src/entities/user.entity';
import { Address } from 'src/entities/address.entity';
import { Coupon } from 'src/entities/coupon.entity';
import { CartTransaction } from 'src/entities/cartTransaction.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,

    @InjectRepository(CartTransaction)
    private readonly cartTransactionRepository: Repository<CartTransaction>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      userId,
      addressId,
      couponId,
      orderStatus,
      methodShipping,
      listCartTransactionId,
    } = createOrderDto;

    // Kiểm tra user tồn tại
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra address tồn tại
    const address = await this.addressRepository.findOne({
      where: { addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Kiểm tra coupon (nếu có)
    let coupon: Coupon | undefined = undefined;
    if (couponId) {
      coupon = await this.couponRepository.findOne({ where: { couponId } });
      if (coupon.quantity <= 0) {
        throw new NotFoundException('Sold Out');
      }
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
    }
    if (orderStatus == OrderStatus.DONE) {
      coupon.quantity = coupon.quantity - 1;
    }
    let totalPrice: number = 0;

    const order = this.orderRepository.create({
      user,
      address,
      coupon: coupon || null,
      methodShipping,
      status: orderStatus,
      price: 0,
    });

    for (const element of listCartTransactionId) {
      const cartTransaction = await this.cartTransactionRepository.findOneBy({
        transactionId: element,
      });
      if (cartTransaction) {
        totalPrice += cartTransaction.price;
      }
    }
     if (orderStatus == OrderStatus.DONE) {
      totalPrice = totalPrice - coupon.discountPercent;
     }
    order.price = totalPrice;
    // Lưu order vào cơ sở dữ liệu
    await this.couponRepository.save(coupon);
    return await this.orderRepository.save(order);
  }

  async updateOrder(updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { orderId, status, addressId, couponId, methodShipping } =
      updateOrderDto;

    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['address', 'coupon', 'transactions'], // Lấy các quan hệ
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (status) {
      order.status = status;
    }

    if (addressId) {
      const address = await this.addressRepository.findOne({
        where: { addressId },
      });
      if (!address) {
        throw new NotFoundException('Address not found');
      }
      order.address = address;
    }

    if (couponId) {
      const coupon = await this.couponRepository.findOne({
        where: { couponId },
      });
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
      order.coupon = coupon;
    }

    if (methodShipping) {
      order.methodShipping = methodShipping;
    }

    return this.orderRepository.save(order);
  }

  async getHistoryOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: [
        {
          user: { id: userId },
          status: OrderStatus.DONE,
        },
        {
          user: { id: userId },
          status: OrderStatus.FINISH_ORDER,
        },
      ],
      relations: ['transactions.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderId },
      relations: ['user', 'address', 'coupon'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['address', 'coupon'],
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'address', 'coupon', 'transactions.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
