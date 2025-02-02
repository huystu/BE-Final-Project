import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Address } from './address.entity';
import { Coupon } from './coupon.entity';
import { CartTransaction } from './cartTransaction.entity';

export enum MethodShippingEnum {
  COD = 'cod',
  BANKING = 'banking',
}

export enum OrderStatus {
  FINISH_ORDER = 'finish_order',
  NOT_PAYMENT = 'not_payment',
  PAYMENT_SUCCESS = 'payment_success',
  DONE = 'done',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: string; // ID đơn hàng (UUID)

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User; // Liên kết với User

  @ManyToOne(() => Address, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'addressId' })
  address: Address; // Liên kết với Address

  @ManyToOne(() => Coupon, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'couponId' })
  coupon?: Coupon; // Liên kết với Coupon (cho phép null)

  @OneToMany(
    () => CartTransaction,
    (cartTransaction) => cartTransaction.order,
    {
      cascade: true,
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  transactions: CartTransaction[];

  @Column({ type: 'float' })
  price: number;

  @Column({
    type: 'enum',
    enum: MethodShippingEnum,
    nullable: true,
  })
  methodShipping: MethodShippingEnum;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    // default: OrderStatus.FINISH_ORDER,
  })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // Ngày tạo đơn hàng

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // Ngày cập nhật cuối cùng
}
