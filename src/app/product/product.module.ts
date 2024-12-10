/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryModule } from '../category/category.module';  
import { Category } from 'src/entities/category.entity';  
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { Variant } from 'src/entities/variant.entity';
import { ProductPhotoModule } from '../productPhoto/productPhoto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductPhoto, Variant]),
    CategoryModule,
    ProductPhotoModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
