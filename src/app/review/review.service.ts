/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Tạo mới đánh giá
  async createReview(
    createReviewDto: CreateReviewDto,
    userId: string,
    productId: string,
  ): Promise<Review> {
    // Tìm người dùng và sản phẩm
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
      throw new Error('Không tìm thấy người dùng hoặc sản phẩm');
    }

    // Tạo đánh giá mới
    const review = this.reviewRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user,
      product,
    });

    return this.reviewRepository.save(review);
  }

  // Lấy danh sách đánh giá của một sản phẩm
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'], // Bao gồm thông tin người dùng
      order: { createdAt: 'DESC' }, // Sắp xếp mới nhất trước
    });
  }

  // Cập nhật đánh giá
  async updateReview(
    reviewId: string, 
    userId: string, 
    updateReviewDto: Partial<CreateReviewDto>
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({ 
      where: { 
        id: reviewId, 
        user: { id: userId } 
      } 
    });

    if (!review) {
      throw new Error('Không tìm thấy đánh giá hoặc người dùng không được phép');
    }

    // Cập nhật các trường của đánh giá
    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }
    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    return this.reviewRepository.save(review);
  }

  // Xóa đánh giá
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const result = await this.reviewRepository.delete({
      id: reviewId,
      user: { id: userId }
    });

    if (result.affected === 0) {
      throw new Error('Không tìm thấy đánh giá hoặc người dùng không được phép');
    }
  }
}