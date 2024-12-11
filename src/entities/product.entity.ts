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
//import { Variant } from './variant.entity';
import { Brand } from './brand.entity';

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

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'boolean', default: false })
  isDelete: boolean;

  @Column({ type: 'varchar', array: true })
  color: string[];

  @Column({ type: 'varchar', array: true })
  size: string[];

  @Column({ type: 'varchar', array: true })
  urls: string[];

  // @Column({
  //   type: 'json',
  //   default: { description: '', policy: '' },
  // })
  // info: ProductInfo;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
  photos: ProductPhoto[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartTransaction, (transaction) => transaction.cart)
  transactions: CartTransaction[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;
}
