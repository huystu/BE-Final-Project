/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { Product } from './product.entity';
  import { User } from './user.entity'; 
  
  @Entity('review')
  export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    rating: number;
  
    @Column()
    comment: string;
  
    @ManyToOne(() => Product, (product) => product.reviews)
    product: Product;
  
    @ManyToOne(() => User, (user) => user.reviews)
    user: User;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  