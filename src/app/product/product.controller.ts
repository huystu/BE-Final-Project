import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { PageOptionsDto } from 'src/common/pagination/paginationOptions';

@Controller('product')
@ApiTags('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.productService.findAll(pageOptionsDto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productService.findById(id);
  }
}
