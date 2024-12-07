/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
//import {  UseGuards } from '@nestjs/common';
//import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { ProductPhoto } from 'src/entities/productPhoto.entity';
import { Variant } from 'src/entities/variant.entity';
import { FilterDto } from '../filter/dto/filter.dto';

@Controller('product')
@ApiTags('product')
//@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(Product) 
    private productRepository: Repository<Product>,
    @InjectRepository(Category) 
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductPhoto) 
    private productPhotoRepository: Repository<ProductPhoto>,
    @InjectRepository(Variant) 
    private variantRepository: Repository<Variant>,
  ) {}

  @Get('filter')
  async filterProductsByQueryParams(
    @Query('q') q: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('categoryId') categoryId: string,
    @Query('orderBy') orderBy: 'ASC' | 'DESC',
  ) {
    const filterDto: FilterDto = {
      q,
      minPrice,
      maxPrice,
      page: page || 1,
      limit: limit || 10,
      orderBy: orderBy || 'DESC',
      categoryId,
    };
    return this.productService.filterProducts(filterDto);
  }




  @Post() 
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get()
  async getAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.productService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Get('category/:id')
  async getByCategory(@Param('id') categoryId: string, @Query() pageOptionsDto: PageOptionsDto) {
  return this.productService.findByCategory(categoryId, pageOptionsDto);
}

@Get(':productId/price')
async getPrice(@Param('productId') productId: string, @Query('size') size: string, @Query('color') color: string) {
  return this.productService.getPriceBySizeAndColor(productId, size, color);
}
}
