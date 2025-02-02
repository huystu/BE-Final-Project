/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/database/database.module';
import { UserModule } from './app/users/user.module';
import { ProductPhotoModule } from './app/productPhoto/productPhoto.module';
import { ProductModule } from './app/product/product.module';
import { CategoryModule } from './app/category/category.module';
import { MailModule } from './provider/mail/mail.module';
import { CartModule } from './app/cart/cart.module';
import { PaymentModule } from './app/payment/vnpay.module';
import { UploadModule } from './upload/upload.module';
import { BrandModule } from './app/brand/brand.module';
import { AddressModule } from './app/address/address.module';
import { CouponModule } from './app/coupon/coupon.module';
import { OrderModule } from './app/order/order.module';
import { ReviewModule } from './app/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    UserModule,
    ProductPhotoModule,
    ProductModule,
    CategoryModule,
    MailModule,
    CartModule,
    PaymentModule,
    UploadModule,
    BrandModule,
    AddressModule,
    CouponModule,
    OrderModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
