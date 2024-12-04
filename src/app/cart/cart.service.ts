import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository, Transaction } from 'typeorm';
import { Cart } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { AddProductToCartDto } from './dto/addProductToCart.dto';
import { CartTransaction } from 'src/entities/cartTransaction.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(CartTransaction)
    private readonly cartTransactionRepository: Repository<CartTransaction>,

    private readonly userService: UserService,
  ) {}

  async getCartByCartId(id: string): Promise<Cart> {
    const currentCart = await this.cartRepository.findOne({
      where: {
        cartId: id,
      },
      relations: {
        transactions: {
          product: true,
        },
      },
    });
    if (!currentCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return currentCart;
  }

  async getCartItemsByUserId(userId: string): Promise<CartTransaction[]> {
    
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isDelete: false },
      relations: ['transactions', 'transactions.product'], 
    });

    if (!cart) {
      throw new NotFoundException(`Cart for user with ID ${userId} not found`);
    }

    return cart.transactions;
  }

  async addProductToCart(
    cartId: string,
    addProductDto: AddProductToCartDto,
  ): Promise<Cart> {
    const { product, userId, discount } = addProductDto;

    const listProduct = await this.productRepository.find({
      where: { id: In(product), quantity: MoreThan(0) },
    });

    const existingIds = listProduct.map((record) => record.id);

    const missingIds = product.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Product with ID ${missingIds.join(', ')} not found`,
      );
    }
    

    const currentCart = await this.cartRepository.findOne({
      where: {
        cartId: cartId,
      },
      relations: ['transactions'],
    });

    const currentUser = await this.userService.getUsersById(userId);

    if (!currentCart) {
      const newCart = this.cartRepository.create({
        user: currentUser,
        discount: discount,
      });

      const listOrderDetails = listProduct.map((item) => {
        return this.cartTransactionRepository.create({
          cart: newCart,
          product: item,
          quantity: 1,
          price: item.price,
        });
      });

      await this.cartRepository.save(newCart);
      await this.cartTransactionRepository.save(listOrderDetails);
      await this.caculateTotalPrice(cartId);

      return await this.cartRepository.findOne({
        where: { cartId: newCart.cartId },
        relations: {
          transactions: true,
        },
      });
    } else {
      const listOrderDetailsId = currentCart.transactions.map(
        (item) => item.transactionId,
      );

      const listOrderDetails = await this.cartTransactionRepository.find({
        where: {
          transactionId: In(listOrderDetailsId),
        },
        relations: {
          product: true,
        },
      });

      for (const item of listProduct) {
        const existingTransaction = listOrderDetails.find(
          (transaction) => transaction.product.id === item.id,
        );

        if (existingTransaction) {
          existingTransaction.quantity += 1;
          existingTransaction.price = existingTransaction.quantity * item.price;
          await this.cartTransactionRepository.save(existingTransaction);
        } else {
          const newTransaction = this.cartTransactionRepository.create({
            cart: currentCart,
            product: item,
            quantity: 1,
            price: item.price,
          });

          if (discount) {
            currentCart.discount = discount;
            await this.cartRepository.save(currentCart);
          }

          await this.cartTransactionRepository.save(newTransaction);
        }
      }
    }
    await this.caculateTotalPrice(cartId);
  }

  async minusQuantityOrderDetails(id: string): Promise<boolean> {
    const orderDetails = await this.cartTransactionRepository.findOne({
      where: {
        transactionId: id,
      },
      relations: ['product', 'cart'],
    });
    if (!orderDetails) {
      throw new NotFoundException('Order details not found');
    }

    const currentProduct = await this.productRepository.findOne({
      where: {
        id: orderDetails.product.id,
      },
    });

    if (orderDetails.quantity <= 0) {
      throw new BadRequestException('Cannot reduce quantity below zero');
    }

    orderDetails.quantity -= 1;
    currentProduct.quantity += 1;
    orderDetails.price = orderDetails.quantity * currentProduct.price;
    await this.cartTransactionRepository.save(orderDetails);
    await this.productRepository.save(currentProduct);

    await this.caculateTotalPrice(orderDetails.cart.cartId);

    return true;
  }

  async plusQuantityOrderDetails(id: string): Promise<boolean> {
    const orderDetails = await this.cartTransactionRepository.findOne({
      where: {
        transactionId: id,
      },
      relations: ['product', 'cart'],
    });
    if (!orderDetails) {
      throw new NotFoundException('Order details not found');
    }

    const currentProduct = await this.productRepository.findOne({
      where: {
        id: orderDetails.product.id,
      },
    });

    if (currentProduct.quantity <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    orderDetails.quantity += 1;
    currentProduct.quantity -= 1;
    orderDetails.price = orderDetails.quantity * currentProduct.price;

    await this.cartTransactionRepository.save(orderDetails);
    await this.productRepository.save(currentProduct);

    await this.caculateTotalPrice(orderDetails.cart.cartId);

    return true;
  }

  async caculateTotalPrice(id: string): Promise<unknown> {
    const currentCart = await this.cartRepository.findOne({
      where: {
        cartId: id,
      },
      relations: {
        transactions: true,
      },
    });
    let totalPrice: number = 0;
    for (const item of currentCart.transactions) {
      totalPrice += item.price;
    }
    currentCart.price = Math.max(0, totalPrice - currentCart.discount);

    return await this.cartRepository.save(currentCart);
  }

  async deleteProduct(id: string): Promise<CartTransaction> {
    const currentProductInCart = await this.cartTransactionRepository.findOne({
      where: {
        transactionId: id,
      },
    });
    if (!currentProductInCart) {
      throw new NotFoundException('Not Found If');
    }
    return await this.cartTransactionRepository.remove(currentProductInCart);
  }
}
