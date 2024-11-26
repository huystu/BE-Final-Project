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
import { VnpayModule } from './app/payment/vnpay.module';
import { OrderDetailsModule } from './app/order/orderDetails.module';

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
    VnpayModule,
    OrderDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
