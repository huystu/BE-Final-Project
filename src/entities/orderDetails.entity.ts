import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity'; // Đường dẫn của `cart.entity` đã có

@Entity('order_details')
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.orderDetails, { onDelete: 'CASCADE' })
  cart: Cart;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
