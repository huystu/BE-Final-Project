/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductPhoto } from './productPhoto.entity';
import { CartTransaction } from './cartTransaction.entity';
import { Variant } from './variant.entity';
import { Review } from './review.entity';

export interface ProductInfo {
  description: string;
  policy: string;
}

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @Column({ type: 'json' })
  info: ProductInfo;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
  photos: ProductPhoto[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartTransaction, (transaction) => transaction.cart)
  transactions: CartTransaction[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}