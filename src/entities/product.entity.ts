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

export interface ProductInfo {
  description: string;
  color: Array<string>;
  size: Array<string>;
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

  @Column({ type: 'json' })
  info: ProductInfo;

  @Column({ type: 'int' })
  quantity: number;

  @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
  photos: ProductPhoto[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
