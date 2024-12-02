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

@Controller('product')
@ApiTags('product')
//@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post() 
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('filter')
async filterByPrice(
  @Query('minPrice') minPrice?: string,
  @Query('maxPrice') maxPrice?: string,
): Promise<Product[]> {
  const min = minPrice ? parseFloat(minPrice) : 0; 
  const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_VALUE; 
  return this.productService.filterByPrice(min, max);
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

}
