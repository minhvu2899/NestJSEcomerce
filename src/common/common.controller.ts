import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailOptions } from '@nextnm/nestjs-mailgun';
import { MailgunEmailModel } from '@nextnm/nestjs-mailgun/dist/nestjs-mailgun/classes/mailgun-email-model';
@Controller('config')
export class CommonController {
  constructor(private configService: ConfigService) {}
  @Get('/paypal')
  getClientIDPaypal() {
    return this.configService.get('DOMAIN_EMAIL');
  }
  // @Get('/email')
  // async sendEmail() {
  //   const email = new MailgunEmailModel(
  //     `vhm@sandbox702ed7ab69aa4f0fb0bfdd033afbc608.mailgun.org`,
  //     `Minh <vhm2899@gmail.com>`,
  //     'Đơn hàng tại BookStore đã được đặt!',
  //     'Cảm ơn bạn đã đặt hàng',
  //     `Xin chào f,

  //     Đơn hàng #9144 đã được đặt thành công và chúng tôi đang xử lý

  //     [Đơn hàng #9144] (20 Tháng Mười Một, 2020)
  //     Sản phẩm	Số lượng	Giá
  //     999 Lá Thư Gửi Cho Chính Mình - Mong Bạn Trở Thành Phiên Bản Hoàn Hảo Nhất (Tái Bản 2020)	1	79.000₫
  //     Tổng số phụ:	79.000₫
  //     Phương thức thanh toán:	Thanh toán khi giao hàng
  //     Tổng cộng:	79.000₫
  //     Địa chỉ thanh toán
  //     f ssss
  //     Phu Xuyen
  //     Hà Nội
  //     111111111
  //     vhm2899@gmail.com
  //     Thanks for using localhost!`,
  //     // attachment: 'ádsadasd',
  //   );

  //   return await this.mailgunService.sendEmail(email);
  // }
}
