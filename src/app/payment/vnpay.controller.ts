import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import * as crypto from 'crypto';
import { VnpayService } from './vnpay.service';
import { CreatePaymentDto } from '../../auth/dto/vnpay.dto';

@Controller('payment')
export class VnpayController {
  constructor(private readonly vnpayService: VnpayService) { }

  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { orderId, amount, orderDescription } = createPaymentDto;

    const paymentUrl = this.vnpayService.generatePaymentUrl(
      orderId,
      amount,
      orderDescription,
    );

    return { paymentUrl };
  }

  @Get('vnpay-return')
  async handleVnpayReturn(
    @Query() query: Record<string, string | number | boolean>,
  ) {
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'] as string;
    delete vnp_Params['vnp_SecureHash'];

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {} as Record<string, string | number | boolean>);

    const querystring = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');

    const hash = crypto
      .createHmac('sha512', this.vnpayService.getVnpHashSecret())
      .update(querystring)
      .digest('hex');

    if (hash !== secureHash) {
      throw new Error('Invalid signature from VNPay');
    }

    const orderId = vnp_Params['vnp_TxnRef'] as string;
    const paymentStatus = vnp_Params['vnp_ResponseCode'] as string;

    if (paymentStatus === '00') {
      return { message: 'Payment successful', orderId };
    } else {
      return { message: 'Payment failed', orderId };
    }
  }
}
