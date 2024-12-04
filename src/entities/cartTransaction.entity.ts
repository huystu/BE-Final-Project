import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_transaction')
export class CartTransaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => Cart, (cart) => cart.transactions, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.transactions, {onDelete: 'CASCADE'})
  product: Product;

  @Column({ type: 'boolean', default: false })
  isDelete: number;
  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  price: number;

  @CreateDateColumn({ type: 'date', nullable: true })
  createdAt: Date;
  @UpdateDateColumn({ type: 'date', nullable: true })
  updateAt: Date;
}
