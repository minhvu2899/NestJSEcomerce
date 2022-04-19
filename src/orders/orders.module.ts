import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from 'src/roles/roles.module';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Payment } from './payment.entity';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from './../cart/cart.module';
import { OrderTrack } from '../order-track/order-track.entity';
import { StatisticsModule } from 'src/statistics/statistics.module';
import { HttpModule } from '@nestjs/axios';
import { GhtkModule } from './../ghtk/ghtk.module';
import { CouponModule } from './../coupon/coupon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Payment]),
    ProductsModule,
    CartModule,
    StatisticsModule,
    HttpModule,
    GhtkModule,
    CouponModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
