/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryModule } from '../category/category.module';  // Nhập CategoryModule vào đây
import { Category } from 'src/entities/category.entity';  // Đảm bảo Category entity được nhập vào đây

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),  // Đảm bảo Category entity được tiêm vào module này
    CategoryModule,  // Nhập CategoryModule vào đây để sử dụng CategoryRepository
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
