import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
// import { Parser } from 'json2csv';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';

@Controller('orders')
// @UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Get()
  async all(@Query('page') page = 1) {
    return this.orderService.paginate(page, ['order_items,comments']);
  }
  @Get('/status')
  async getOrderFilter(@Query() filterOrder: FilterOrderDto) {
    return this.orderService.getOrdersByStatus(filterOrder);
  }
  @Get('/reportByCustomer')
  async reportByCustomer(
    @Query('date_start') date_start,
    @Query('date_end') date_end,
  ) {
    return this.orderService.reportByCustomer(date_start, date_end);
  }
  @Get('/reportByProduct')
  async reportByProduct(
    @Query('date_start') date_start,
    @Query('date_end') date_end,
  ) {
    return this.orderService.reportByProduct(date_start, date_end);
  }
  @Get('/reportCustomerById')
  async reportCustomerById(
    @Query('date_start') date_start,
    @Query('date_end') date_end,
    @Query('id') id,
  ) {
    return this.orderService.reportCustomerByID(date_start, date_end, id);
  }
  @Get('/:id')
  async getOrderById(@Param('id') id) {
    return this.orderService.findOne(id, ['order_items', 'order_tracks']);
  }
  @Post()
  async create(@Body() data: CreateOrderDto) {
    return this.orderService.createOrder(data);
  }

  // @Post('/export')
  // async export(@Res() res: Response) {
  //   const parser = new Parser({
  //     fields: ['ID', 'Name', 'Email', 'Product Title', 'Price', 'Quantity'],
  //   });

  //   const orders = await this.orderService.all(['order_items']);

  //   const json = [];

  //   orders.forEach((o: Order) => {
  //     json.push({
  //       ID: o.id,
  //       Name: o.full_name,
  //       Email: o.email,
  //       'Product Title': '',
  //       Price: '',
  //       Quantity: '',
  //     });

  //     o.order_items.forEach((i: OrderItem) => {
  //       json.push({
  //         ID: '',
  //         Name: '',
  //         Email: '',
  //         'Product Title': i.product_title,
  //         Price: i.price,
  //         Quantity: i.quantity,
  //       });
  //     });
  //   });

  //   const csv = parser.parse(json);
  //   res.header('Content-Type', 'text/csv');
  //   res.attachment('orders.csv');
  //   return res.send(csv);
  // }

  @Get('chart')
  async chart() {
    return this.orderService.chart();
  }
  @Get('/user/:id')
  getOrderByUser(@Query() filterOrder, @Param('id') id: string) {
    return this.orderService.getOrdersByStatusAndUser(filterOrder, id);
    // return this.orderService.find({ user });
  }
  @Patch('/:id/payment')
  updateOrderPayment(@Body() updateProduct, @Param('id') id: string) {
    return this.orderService.updateOrderPayment(id, updateProduct);
  }
  @Patch('/:id/status')
  updateOrderStatus(@Body('status') status, @Param('id') id: string) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
