import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartTransaction } from 'src/entities/cartTransaction.entity';
import { Product } from 'src/entities/product.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { AddProductToCartDto } from './dto/addProductToCart.dto';
import { UpdateInformationCartDto } from './dto/updateInformationCart.dto';

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
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.transactions', 'transactions')
      .leftJoinAndSelect('transactions.product', 'product')
      .where('cart.userId = :userId', { userId })
      .andWhere('cart.isDelete = :isDelete', { isDelete: false })
      .andWhere('transactions.order IS NULL')
      .getOne();

    if (!cart) {
      throw new NotFoundException(`Cart for user with ID ${userId} not found`);
    }

    return cart.transactions;
  }

  async getHistoryCart(userId: string): Promise<Cart[]> {
    const cart = await this.cartRepository.find({
      where: {
        user: {
          id: userId,
        },
        // status: In([CartStatus.PROCESS, CartStatus.DONE]),
      },
      relations: ['transactions.product'],
    });
    return cart;
  }

  async updateInformationCart({
    updateCartDto,
  }: {
    updateCartDto: UpdateInformationCartDto;
  }): Promise<Cart> {
    const { cartId, address } = updateCartDto;

    const currentCart = await this.cartRepository.findOne({
      where: {
        cartId: cartId,
        // status: Not(CartStatus.DONE),
      },
    });
    if (!currentCart) {
      throw new NotFoundException('Id not Valid');
    }
    currentCart.address = address;
    // currentCart.methodShipping = methodShipping;
    return await this.cartRepository.save(currentCart);
  }

  async addProductToCart(addProductDto: AddProductToCartDto): Promise<Cart> {
    const { userId, productId, quantity, discount } = addProductDto;

    let currentCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isDelete: false },
      relations: ['transactions', 'transactions.product'],
    });

    if (!currentCart) {
      const currentUser = await this.userService.getUsersById(userId);
      currentCart = this.cartRepository.create({
        user: currentUser,
        discount: discount || 0,
      });
      await this.cartRepository.save(currentCart);
      currentCart.transactions = [];
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.quantity === 0) {
      throw new BadRequestException(`Product ${product.name} is out of stock`);
    }

    if (product.quantity < quantity) {
      throw new BadRequestException(
        `Only ${product.quantity} items of ${product.name} are available in stock`,
      );
    }

    const existingTransaction = currentCart.transactions.find(
      (transaction) => transaction.product.id === productId,
    );

    if (existingTransaction) {
      if (existingTransaction.quantity + quantity > product.quantity) {
        throw new BadRequestException(
          `You cannot add ${quantity} more items of ${product.name}. Only ${product.quantity - existingTransaction.quantity} items left in stock.`,
        );
      }

      existingTransaction.quantity += quantity;
      existingTransaction.price = existingTransaction.quantity * product.price;
      await this.cartTransactionRepository.save(existingTransaction);
    } else {
      const newTransaction = this.cartTransactionRepository.create({
        cart: currentCart,
        product: product,
        quantity: quantity,
        price: quantity * product.price,
      });
      await this.cartTransactionRepository.save(newTransaction);
    }

    product.quantity -= quantity;
    await this.productRepository.save(product);

    await this.caculateTotalPrice(currentCart.cartId);

    return await this.cartRepository.findOne({
      where: { cartId: currentCart.cartId },
      relations: ['transactions', 'transactions.product'],
    });
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

  async getTotalQuantityByUserId(userId: string): Promise<number> {
    const currentCart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isDelete: false },
      relations: ['transactions'],
    });

    if (!currentCart) {
      throw new NotFoundException(`Cart for user with ID ${userId} not found`);
    }

    const totalQuantity = currentCart.transactions.reduce(
      (total, transaction) => total + transaction.quantity,
      0,
    );

    return totalQuantity;
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
