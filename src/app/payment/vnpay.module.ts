import { Module } from '@nestjs/common';
import { PaymentService } from './vnpay.service';
import { PaymentController } from './vnpay.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
