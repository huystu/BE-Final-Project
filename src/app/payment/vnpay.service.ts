import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnpayService {
  private readonly vnp_TmnCode = '62Y98TCN';
  private readonly vnp_HashSecret = 'E2O0A9U6HETKZU8GPR10O7G5MWJ9M917';
  private readonly vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private readonly vnp_ReturnUrl = 'http://localhost:3000/payment/vnpay-return';

  getVnpHashSecret(): string {
    return this.vnp_HashSecret;
  }
  generatePaymentUrl(orderId: string, amount: number, orderInfo: string): string {
    const date = new Date();
    const createDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount,
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sortedParams = Object.keys(vnp_Params).sort().reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {} as Record<string, string | number>);

    const querystring = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');

    const signData = this.vnp_HashSecret + querystring;
    const secureHash = crypto.createHmac('sha512', this.vnp_HashSecret)
                              .update(signData)
                              .digest('hex');

    return `${this.vnp_Url}?${querystring}&vnp_SecureHash=${secureHash}`;
  }
}
