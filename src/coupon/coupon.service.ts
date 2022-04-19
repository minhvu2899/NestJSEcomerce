import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
  ) {}
  getAll(): Promise<Coupon[]> {
    return this.couponRepository.find({});
  }
  async getCouponById(id: string) {
    const coupon = await this.couponRepository.findOne(id);
    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }
    return coupon;
  }
  async createCoupon(createCouponDto) {
    const coupon = this.couponRepository.create({
      ...createCouponDto,
    });

    return await this.couponRepository.save(coupon);
  }
  async updateCoupon(id, couponDto) {
    const coupon = await this.couponRepository.findOne(id);
    if (!coupon) {
      throw new NotFoundException('Address not found');
    }
    coupon.coupon_code = couponDto.city;
    coupon.min_price = couponDto.min_price;
    coupon.value = couponDto.value;
    coupon.usage_quantity = couponDto.usage_quantity;
    coupon.type = couponDto.type;
    coupon.name = couponDto.name;
    coupon.date_start = couponDto.date_start;
    coupon.date_end = couponDto.date_end;
    return await this.couponRepository.save(coupon);
  }
  async deleteCoupon(id: string) {
    const coupon = this.getCouponById(id);
    if (coupon) {
      await this.couponRepository.delete(id);
    }
  }
  async checkCoupon(coupon_code: string, price: number) {
    const coupon = await this.couponRepository.findOne({
      where: { coupon_code: coupon_code },
    });
    const now = new Date();
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (now > coupon.date_start && now < coupon.date_end) {
      if (coupon.usage_quantity === 0) {
        throw new BadRequestException('Mã hết số lần sử dụng');
      }
      if (coupon.min_price > price) {
        throw new BadRequestException('Đơn hàng không đủ điều kiện sử dụng');
      }
      return coupon;
    } else {
      throw new BadRequestException('Mã hết hạn thời gian sử dụng');
    }
  }
  async getCoupon(coupon_code) {
    return this.couponRepository.findOne({ coupon_code });
  }
  async save(coupon) {
    return this.couponRepository.save(coupon);
  }
}
