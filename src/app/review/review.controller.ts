/* eslint-disable prettier/prettier */
import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    UseGuards, 
    Request 
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    // Tạo đánh giá mới
    @UseGuards(JwtAuthGuard)
    @Post(':productId')
    async createReview(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req
    ) {
    return this.reviewService.createReview(
        createReviewDto, 
        req.user.id, // Giả sử JWT cung cấp ID người dùng
        productId
    );
    }

    // Lấy các đánh giá của sản phẩm
    @Get(':productId')
    async getProductReviews(@Param('productId') productId: string) {
    return this.reviewService.getReviewsByProduct(productId);
    }

    // Cập nhật đánh giá
    @UseGuards(JwtAuthGuard)
    @Put(':reviewId')
    async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: Partial<CreateReviewDto>,
    @Request() req
    ) {
    return this.reviewService.updateReview(
        reviewId, 
        req.user.id, 
        updateReviewDto
    );
    }

    // Xóa đánh giá
    @UseGuards(JwtAuthGuard)
    @Delete(':reviewId')
    async deleteReview(
    @Param('reviewId') reviewId: string,
    @Request() req
    ) {
    await this.reviewService.deleteReview(reviewId, req.user.id);
    return { message: 'Đã xóa đánh giá thành công' };
    }
}