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

    // Kiểm tra sự tồn tại của user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kiểm tra sự tồn tại của address
    const address = await this.addressRepository.findOne({
      where: { addressId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Kiểm tra và xử lý coupon (nếu có)
    let coupon: Coupon | undefined;
    let discountPercent = 0; // Giá trị giảm giá cố định
    if (couponId) {
      coupon = await this.couponRepository.findOne({ where: { couponId } });
      if (!coupon) {
        throw new NotFoundException('Coupon not found');
      }

      if (coupon.quantity <= 0) {
        throw new BadRequestException('Coupon is sold out');
      }

      discountPercent = coupon.discountPercent || 0; 
    }

    // Tạo đơn hàng
    const order = this.orderRepository.create({
      user,
      address,
      coupon: coupon || null,
      methodShipping,
      status: orderStatus,
      price: 0, // Sẽ tính toán lại sau
    });

    // Duyệt qua danh sách CartTransaction và tính tổng giá
    const cartTransactions: CartTransaction[] = [];
    let totalPrice = 0;

    for (const transactionId of listCartTransactionId) {
      const cartTransaction = await this.cartTransactionRepository.findOne({
        where: { transactionId },
      });

      if (!cartTransaction) {
        throw new NotFoundException(
          `CartTransaction with ID ${transactionId} not found`,
        );
      }

      totalPrice += cartTransaction.price;
      cartTransaction.order = order; // Gắn order vào CartTransaction
      cartTransactions.push(cartTransaction);
    }

    // Trừ giá trị cố định của coupon nếu có và trạng thái đơn hàng là DONE
    if (coupon && orderStatus === OrderStatus.DONE) {
      totalPrice -= discountPercent; // Sử dụng giá trị giảm cố định
      totalPrice = Math.max(totalPrice, 0); // Đảm bảo giá trị không âm
      coupon.quantity -= 1; // Giảm số lượng coupon còn lại
    }

    // Gán giá trị đã tính toán cho đơn hàng
    order.price = totalPrice;

    // Lưu đơn hàng và các CartTransaction
    await this.orderRepository.save(order);
    await this.cartTransactionRepository.save(cartTransactions);

    // Lưu coupon nếu có
    if (coupon) {
      await this.couponRepository.save(coupon);
    }

    return order;
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
