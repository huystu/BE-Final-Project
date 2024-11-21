import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';

@Entity('cart_transaction')
export class CartTransaction {
  @PrimaryGeneratedColumn('uuid')
  transactionId: string;

  @ManyToOne(() => Cart, (cart) => cart.transactions)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.transactions)
  product: Product;

  @Column({ type: 'boolean', default: false })
  isDelete: number;
  @Column({ type: 'int', default: 0, nullable: true })
  quantity: number;

  @Column({ type: 'float', default: 0, nullable: true })
  price: number;

  @CreateDateColumn()
  createdAt: Date;
  @CreateDateColumn({ type: 'date', nullable: true })
  updateAt: Date;
}
