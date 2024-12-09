/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('cart_transaction')
export class CartTransaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => Cart, (cart) => cart.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' }) 
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.transactions, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.transactions, {
    onDelete: 'CASCADE', 
    nullable: true, 
  })
  @JoinColumn({ name: 'orderId' }) 
  order: Order; 

  @Column({ type: 'boolean', default: false })
  isDelete: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  price: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updateAt: Date;
}
