import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CouponService } from './coupon.service';

@Controller('coupons')
export class CouponController {
  constructor(private couponService: CouponService) {}
  @Get()
  getAll() {
    return this.couponService.getAll();
  }
  @Post('/:coupon/check')
  checkCoupon(
    @Param('coupon') coupon_code: string,
    @Query('price') price: number,
  ) {
    return this.couponService.checkCoupon(coupon_code, price);
  }
  @Get('/:id')
  getAddressById(@Param('id') id: string) {
    return this.couponService.getCouponById(id);
  }
  @Post('')
  createCoupon(@Body() createCouponDto) {
    return this.couponService.createCoupon(createCouponDto);
  }
  @Patch('/:id')
  updateCoupon(@Body() updateCouponDto, @Param('id') id: string) {
    return this.couponService.updateCoupon(id, updateCouponDto);
  }
  @Delete('/:id')
  deteleCoupon(@Param('id') id: string) {
    return this.couponService.deleteCoupon(id);
  }
}
