import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(receive: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: receive,
        from: 'quangvunguyen153@gmail.com', // sender address
        subject: 'OTP Vetification',
        text: '',
        html: `${code}`,
      });
      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  }
}
