import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductPhotoService } from './productPhoto.service';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { ProductPhotoController } from './productPhoto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductPhoto, Product])],
  controllers: [ProductPhotoController],
  providers: [ProductPhotoService],
  exports: [ProductPhotoService],
})
export class ProductPhotoModule {}
