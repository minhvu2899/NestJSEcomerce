import { Controller, Get, Res, Query, Body, Post } from '@nestjs/common';
import { GhtkService } from './ghtk.service';

@Controller('ghtk')
export class GhtkController {
  constructor(private ghtkService: GhtkService) {}
  @Get('/abc')
  abc() {
    return this.ghtkService.createOrder({
      products: [
        {
          name: 'bút',
          weight: 0.1,
          quantity: 1,
          product_code: 1241,
        },
        {
          name: 'tẩy',
          weight: 0.2,
          quantity: 1,
          product_code: 1254,
        },
      ],
      order: {
        id: 'a10',
        pick_name: 'HCM-nội thành',
        pick_address: '590 CMT8 P.11',
        pick_province: 'TP. Hồ Chí Minh',
        pick_district: 'Quận 3',
        pick_ward: 'Phường 1',
        pick_tel: '0382082505',
        tel: '0911222333',
        name: 'GHTK - HCM - Noi Thanh',
        address: '123 nguyễn chí thanh',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        hamlet: 'Khác',
        is_freeship: '1',
        pick_date: '2016-09-30',
        pick_money: 47000,
        note: 'Khối lượng tính cước tối đa: 1.00 kg',
        value: 3000000,
      },
    });
  }
  @Get('/pick-address')
  getPickAddress() {
    return this.ghtkService.getPickAddress();
  }
  @Get('/print')
  printOrder1(@Query('label') label: string) {
    return this.ghtkService.printOrder(label);
  }
  @Post('/feeship')
  caculatorFeeShip(@Body() body) {
    return this.ghtkService.caculatorFeeShip(body);
  }
}
