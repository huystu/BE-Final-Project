import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartTransaction } from './cartTransaction.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  couponCode?: string;

  @Column({ type: 'float', default: 0, nullable: true })
  discount: number;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

  @Column({ type: 'float', default: 0, nullable: true })
  price: number;

  @OneToMany(() => CartTransaction, (transaction) => transaction.cart)
  transactions: CartTransaction[];

}
