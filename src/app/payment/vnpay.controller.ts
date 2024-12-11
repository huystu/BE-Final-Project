import { Controller, Get, Query, Redirect } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { PaymentService } from './vnpay.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('create')
  // @Redirect()
  createPayment(
    @Query('amount') amount: number,
    @Query('orderInfo') orderInfo: string,
    @Query('orderId') orderId: string,
    @Query('bankCode') bankCode?: string,
  ) {
    const paymentUrl = this.paymentService.createPaymentUrl(
      orderInfo,
      amount,
      orderId,
      bankCode,
    );
    return { url: paymentUrl };
  }

  @Get('vnpay-return')
  handleVnPayReturn(@Query() query: any) {
    const vnpSecureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    const sortedParams = this.paymentService.sortObject(query);
    const signData = qs.stringify(sortedParams, { encode: true });
    const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (vnpSecureHash === signed) {
      if (query['vnp_ResponseCode'] === '00') {
        return `<!DOCTYPE html>
          <html>
          <head>
            <title>Thanh toán thành công</title>
          </head>
          <body>
            <h1>Thanh toán thành công!</h1>
            <button onclick="window.location.href='http://localhost:5173/paymentsuccess'">
              Đi tới trang thanh toán thành công
            </button>
          </body>
          </html>`;
      } else {
        return `Thanh toán thất bại với mã lỗi: ${query['vnp_ResponseCode']}`;
      }
    } else {
      return 'Chữ ký không hợp lệ!';
    }
  }
}
