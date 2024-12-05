/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductToCartDto } from './dto/addProductToCart.dto';
import { Cart } from 'src/entities/cart.entity';
import { ApiQuery } from '@nestjs/swagger';
import { CartTransaction } from 'src/entities/cartTransaction.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/:cartId')
  async getCart(@Param('cartId') cartId: string): Promise<Cart> {
    return await this.cartService.getCartByCartId(cartId);
  }
  @ApiQuery({
    name: 'cartId',
    required: false,
    description:
      'Optional cart ID. If not provided, a new cart will be created.',
  })
  @Post('')
  async addProductToCart(
    @Query('cartId') cartId: string,
    @Body() addProductDto: AddProductToCartDto,
  ): Promise<Cart> {
    return this.cartService.addProductToCart(cartId, addProductDto);
  }

  @Get('items/:userId')
  async getCartItemsByUserId(@Param('userId') userId: string) {
    return this.cartService.getCartItemsByUserId(userId);
  }

  @Patch(':id/minus-quantity')
  @HttpCode(HttpStatus.OK)
  async minusQuantity(@Param('id') id: string): Promise<boolean> {
    return await this.cartService.minusQuantityOrderDetails(id);
  }

  @Patch(':id/plus-quantity')
  @HttpCode(HttpStatus.OK)
  async plusQuantity(@Param('id') id: string): Promise<boolean> {
    return await this.cartService.plusQuantityOrderDetails(id);
  }

  @Delete('/product/:productId')
  async deleteProductFromCart(
    @Param('productId') productId: string,
  ): Promise<CartTransaction> {
    return await this.cartService.deleteProduct(productId);
  }
}
