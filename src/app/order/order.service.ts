import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from 'src/entities/user.entity';
import { Address } from 'src/entities/address.entity';
import { Coupon } from 'src/entities/coupon.entity';
import { CartTransaction } from 'src/entities/cartTransaction.entity';

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
      listProductId,
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
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }
    }

    // Tạo mới order
    const order = await this.orderRepository.create({
      user,
      address,
      coupon: coupon || null,
      methodShipping,
      status: orderStatus,
    });

    listProductId.forEach(async (element) => {
      const product = await this.cartTransactionRepository.findOneBy({
        transactionId: element,
      });
      const orderFounded = await this.orderRepository.findOneBy({
        orderId: order.orderId,
      });

      await this.cartTransactionRepository.update(product.transactionId, {
        order: orderFounded,
      });
    });
    // Lưu order vào cơ sở dữ liệu
    return this.orderRepository.save(order);
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
}
