import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Payment } from './payment.entity';
import { CartService } from './../cart/cart.service';
import { ProductsService } from './../products/products.service';
import { description, OrderStatus } from './order-status.enum';
import { OrderTrack } from 'src/order-track/order-track.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StatisticsService } from './../statistics/statistics.service';
import { FilterOrderDto } from './dto/filter-order.dto';
import { query } from 'express';
import { GhtkService } from './../ghtk/ghtk.service';
import { Variants } from './../products/variants.entity';
import { CouponService } from 'src/coupon/coupon.service';

@Injectable()
export class OrdersService extends AbstractService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
    private cartsService: CartService,
    private statisticsService: StatisticsService,
    private ghtkService: GhtkService,
    private couponService: CouponService,
  ) {
    super(ordersRepository);
  }
  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const { data, pagination } = await super.paginate(page, relations);

    return {
      data: data,
      pagination,
    };
  }
  async createOrder(orderDto: CreateOrderDto) {
    const order = this.ordersRepository.create({ ...orderDto });
    const order_track = new OrderTrack();
    order_track.status = OrderStatus.NEW;
    order_track.created_at = new Date();
    order_track.description = description(OrderStatus.NEW);
    const newOrderTracks = [order_track];
    order.order_tracks = newOrderTracks;
    console.log(order);
    if (orderDto.coupon_code) {
      const coupon = await this.couponService.getCoupon({
        coupon_code: orderDto.coupon_code,
      });
      coupon.usage_quantity -= 1;
      coupon.used += 1;
    }
    return await this.ordersRepository.save(order);
  }
  async getOrdersByStatus(
    filterOrder: FilterOrderDto,
  ): Promise<PaginatedResult> {
    const query = this.ordersRepository.createQueryBuilder('order');
    const { _page, _limit, _status } = filterOrder;
    const page = _page ? _page : 1;
    const limit = _limit ? _limit : 5;
    const offset = (page - 1) * limit;
    const status: number = _status ? _status : 0;
    query.limit(limit).offset(offset);
    query.leftJoinAndSelect(`order.order_items`, `order_items`);
    query.leftJoinAndSelect(`order_items.product`, `product`);
    console.log(status, status == 1);

    if (status == 1) {
      query.where('order.order_status = :status', {
        status: OrderStatus.NEW,
      });
    } else if (status == 2) {
      query.where('order.order_status = :status', {
        status: OrderStatus.IN_PROGRESS,
      });
    } else if (status == 3) {
      query.where('order.order_status = :status', {
        status: OrderStatus.PACKAGED,
      });
    } else if (status == 4) {
      query.where('order.order_status = :status', {
        status: OrderStatus.PICKED,
      });
    } else if (status == 5) {
      query.where('order.order_status = :status', {
        status: OrderStatus.DELIVERED,
      });
    } else if (status == 6) {
      query.where('order.order_status = :status', {
        status: OrderStatus.CANCEL,
      });
    }
    console.log(query.getSql());
    const data = await query.getMany();
    return {
      data,
      pagination: {
        total: await query.getCount(),
        current_page: page,
        limit,
      },
    };
  }
  async getOrdersByStatusAndUser(
    filterOrder: FilterOrderDto,
    id: string,
  ): Promise<PaginatedResult> {
    const query = this.ordersRepository.createQueryBuilder('order');
    const { _page, _limit, _status } = filterOrder;
    const page = _page ? _page : 1;
    const limit = _limit ? _limit : 5;
    const offset = (page - 1) * limit;
    const status: number = _status ? _status : 0;
    query.limit(limit).offset(offset);
    query.leftJoinAndSelect(`order.order_items`, `order_items`);
    query.leftJoinAndSelect(`order_items.product`, `product`);
    query.leftJoinAndSelect(`order.comments`, `comments`);
    query.leftJoinAndSelect(`comments.product`, `products`);
    console.log(status, 'ádada');

    if (status == 1) {
      console.log(1);
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.NEW,
      });
    } else if (status == 2) {
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.IN_PROGRESS,
      });
    } else if (status == 3) {
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.PACKAGED,
      });
    } else if (status == 4) {
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.PICKED,
      });
    } else if (status == 5) {
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.DELIVERED,
      });
    } else if (status == 6) {
      query.andWhere('order.order_status = :status', {
        status: OrderStatus.CANCEL,
      });
    }

    query.andWhere('order.user_id=:user', { user: id });
    query.orderBy('order.created_at', 'DESC');
    console.log(query.getSql());
    const data = await query.getMany();
    return {
      data,
      pagination: {
        total: await query.getCount(),
        current_page: page,
        limit,
      },
    };
  }
  async findOne(id, relations) {
    const order = await this.ordersRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.order_items', 'order_items')
      .leftJoinAndSelect('o.order_tracks', 'order_tracks')
      .orderBy('order_tracks.created_at', 'DESC')
      .where('o.id =:orderID', { orderID: id })
      .getOne();
    return order;
  }
  async chart() {
    return this.ordersRepository.query(`
        SELECT DATE_FORMAT(o.created_at, '%Y-%m-%d') as date, sum(i.price * i.quantity) as sum
        FROM orders o
        JOIN order_items i on o.id = i.order_id
        GROUP BY date;
    `);
  }
  async updateOrderPayment(id: string, updateProduct): Promise<Order> {
    const order = await this.ordersRepository.findOne(id, {
      relations: ['order_tracks', 'order_items'],
    });
    console.log(order);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    const { paymentResult } = updateProduct;
    order.is_paid = true;
    order.paid_at = new Date();
    const paymentDetail = new Payment();
    paymentDetail.tran_id = paymentResult.id;
    paymentDetail.status = paymentResult.status;
    paymentDetail.payment_method = 'Paypal';
    paymentDetail.created_at = new Date(paymentResult.create_time);
    paymentDetail.user = order.user;
    paymentDetail.amount_paid = Number.parseInt(
      paymentResult.purchase_units[0].amount.value,
    );
    order.payment = paymentDetail;
    const user = order.user;
    const order_track = new OrderTrack();
    const newOrderTracks = [...order.order_tracks, order_track];
    order_track.status = OrderStatus.PAID;
    order_track.created_at = new Date();
    order_track.description = description(OrderStatus.PAID);
    order.order_tracks = newOrderTracks;
    order.order_status = OrderStatus.IN_PROGRESS;
    const carts = this.cartsService.find({ user });
    // await this.cartsService.remove(carts);
    for (const index in order.order_items) {
      console.log(index);
      const item = order.order_items[index];
      if (item.variant_id) {
        const variant = await this.productsService.getVariant(item.variant_id);
        console.log(variant);
        variant.countInStock -= item.quantity;
        await this.productsService.save(variant);
      } else {
        const product = await this.productsService.findOne(item.product_id);
        product.countInStock -= item.quantity;
        console.log(product);
        await this.productsService.updateProduct(item.product_id, {
          ...product,
        });
      }
    }
    const products = order.order_items.map((p) => ({
      name: p.product_title,
      weight: 1,
      quantity: p.quantity,
      product_code: p.product.id,
    }));
    const data = {
      products,
      order: {
        id: order.id,
        pick_name: 'Hà Nội',
        pick_address: 'Tri Thủy',
        pick_province: 'TP. Hà Nội',
        pick_district: 'Huyện Phú Xuyên',
        pick_ward: 'Xã Tri Thủy',
        pick_tel: '0382082505',
        tel: order.phone_number,
        name: order.full_name,
        address: order.shipping_address.split(',')[0],
        province: order.shipping_address.split(',')[3],
        district: order.shipping_address.split(',')[2],
        ward: order.shipping_address.split(',')[1],
        // address: '123 nguyễn chí thanh',
        // province: 'TP. Hồ Chí Minh',
        // district: 'Quận 1',
        // ward: 'Phường Bến Nghé',
        hamlet: 'Khác',
        street: 'Xóm Trại',
        is_freeship: '1',
        pick_date: new Date(),
        pick_money: order.total,
        note: 'Khối lượng tính cước tối đa: 1.00 kg',
        value: 100000,
      },
    };
    console.log(data);
    const result = await this.ghtkService.createOrder(data).toPromise();
    order.bill_code = result.order.label;
    return await this.ordersRepository.save(order);
  }
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne(id, {
      relations: ['order_tracks', 'order_items'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.order_status = status;
    const order_track = new OrderTrack();
    const newOrderTracks = [...order.order_tracks, order_track];
    order_track.status = status;
    order_track.created_at = new Date();
    order_track.description = description(status);
    order.order_tracks = newOrderTracks;
    console.log(status, status == OrderStatus.CONFIRM);
    console.log(order.shipping_address.split(',')[3]);
    if (status == OrderStatus.CONFIRM) {
      const products = order.order_items.map((p) => ({
        name: p.product_title,
        weight: 1,
        quantity: p.quantity,
        product_code: p.product.id,
      }));
      const data = {
        products,
        order: {
          id: order.id,
          pick_name: 'Hà Nội',
          pick_address: 'Tri Thủy',
          pick_province: 'TP. Hà Nội',
          pick_district: 'Huyện Phú Xuyên',
          pick_ward: 'Xã Tri Thủy',
          pick_tel: '0382082505',
          tel: order.phone_number,
          name: order.full_name,
          address: order.shipping_address.split(',')[0],
          province: order.shipping_address.split(',')[3],
          district: order.shipping_address.split(',')[2],
          ward: order.shipping_address.split(',')[1],
          // address: '123 nguyễn chí thanh',
          // province: 'TP. Hồ Chí Minh',
          // district: 'Quận 1',
          // ward: 'Phường Bến Nghé',
          hamlet: 'Khác',
          street: 'Xóm Trại',
          is_freeship: '1',
          pick_date: new Date(),
          pick_money: order.total,
          note: 'Khối lượng tính cước tối đa: 1.00 kg',
          value: 100000,
        },
      };
      console.log(data);
      const result = await this.ghtkService.createOrder(data).toPromise();
      order.bill_code = result.order.label;
      order.order_status = OrderStatus.IN_PROGRESS;
      console.log(result);
    }
    if (order.order_status == OrderStatus.PACKAGED) {
      for (const index in order.order_items) {
        const item = order.order_items[index];
        if (item.variant_id) {
          const variant = await this.productsService.getVariant(
            item.variant_id,
          );
          if (variant.countInStock < item.quantity) {
            throw new BadRequestException(
              `Sản phẩm có id:${item.product_id} không đủ số lượng trong kho`,
            );
          }
          const product = await this.productsService.findOne(item.product_id);
          if (!order.is_paid) {
            variant.countInStock -= item.quantity;
          }
          await this.productsService.save(variant);
          await this.productsService.updateProduct(item.product.id, {
            ...product,
          });
        } else {
          const product = await this.productsService.findOne(item.product_id);
          if (!order.is_paid) {
            if (product.countInStock < item.quantity) {
              throw new BadRequestException(
                `Sản phẩm có id:${item.product_id} không đủ số lượng trong kho`,
              );
            }
            product.countInStock -= item.quantity;

            await this.productsService.updateProduct(item.product_id, {
              ...product,
            });
          }
        }
      }
    }
    if (status == OrderStatus.PICKED) {
      for (const index in order.order_items) {
        const item = order.order_items[index];
        if (item.variant_id) {
          const variant = await this.productsService.getVariant(
            item.variant_id,
          );

          const product = await this.productsService.findOne(item.product_id);
          if (!order.is_paid) {
            variant.countInStock -= item.quantity;
          }
          await this.productsService.save(variant);
          await this.productsService.updateProduct(item.product.id, {
            ...product,
          });
        } else {
          const product = await this.productsService.findOne(item.product_id);
          if (!order.is_paid) {
            product.countInStock -= item.quantity;

            await this.productsService.updateProduct(item.product_id, {
              ...product,
            });
          }
        }
      }
    }
    if (status == OrderStatus.DELIVERED) {
      for (const index in order.order_items) {
        const item = order.order_items[index];
        if (item.variant_id) {
          const variant = await this.productsService.getVariant(
            item.variant_id,
          );
          const product = await this.productsService.findOne(item.product.id);
          if (!order.is_paid) {
            variant.countInStock -= item.quantity;

            product.sold += item.quantity;

            console.log(variant.countInStock, product.sold);
          } else {
            product.sold += item.quantity;
            console.log(variant.countInStock, product.sold);
          }
          await this.productsService.save(variant);
          await this.productsService.updateProduct(item.product.id, {
            ...product,
          });
        } else {
          const product = await this.productsService.findOne(item.product.id);
          if (!order.is_paid) {
            product.countInStock -= item.quantity;

            product.sold += item.quantity;
            console.log(product.countInStock, product.sold);
          } else {
            product.sold += item.quantity;
            console.log(product.countInStock, product.sold);
          }
          await this.productsService.updateProduct(item.product.id, {
            ...product,
          });
        }
      }

      const gross_sale = order.total;
      const net_sale =
        order.total -
        order.feeship -
        order.product_cost -
        (order.coupon_code ? order.coupon_value : 0);
      const statistics = await this.statisticsService.findStatisticsByDate(
        order.order_date,
      );
      console.log(statistics);
      if (statistics) {
        statistics.gross_sale = statistics.gross_sale + gross_sale;
        statistics.net_sale += net_sale;
        statistics.total_order += 1;
        await this.statisticsService.updateStatistic(statistics);
      } else {
        await this.statisticsService.creatStatistics({
          order_date: order.order_date,
          gross_sale,
          net_sale,
          total_order: 1,
        });
      }
    }
    return await this.ordersRepository.save(order);
  }
  async reportByCustomer(date_start: string, date_end: string) {
    return this.ordersRepository.query(`
    select o.user_id,sum(i.quantity)as total_quantity, sum(o.total) as total_income
    from orders as o 
    JOIN order_items i on o.id = i.order_id  
   where o.created_at::date >='${date_start}' and o.created_at <'${date_end}' 
    group by o.user_id
    `);
  }
  async reportByProduct(date_start: string, date_end: string) {
    return this.ordersRepository.query(`
    select i.product_id,i.product_title,sum(i.quantity)as total_quantity, sum(o.total) as total_income
    from orders as o 
    JOIN order_items i on o.id = i.order_id  
   where o.created_at::date >='${date_start}' and o.created_at <'${date_end}'
    group by i.product_id,i.product_title
    `);
  }
  async reportCustomerByID(date_start: string, date_end: string, id) {
    return this.ordersRepository.query(`
    select o.id,o.created_at,o.order_status,sum(i.quantity)as total_quantity, sum(o.total) as total_income
    from orders as o 
    JOIN order_items i on o.id = i.order_id  
   where o.created_at::date >='${date_start}' and o.created_at <'${date_end}' and o.user_id='${id}' 
    group by  o.id
    `);
  }
}
