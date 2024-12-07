/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { CategoryModule } from '../category/category.module';  
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product, User]),  
    CategoryModule,  
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
