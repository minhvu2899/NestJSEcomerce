import { Controller, Post, Body } from '@nestjs/common';
import { OrderTrackService } from './order-track.service';

@Controller('order-track')
export class OrderTrackController {
  constructor(private orderTrackService: OrderTrackService) {}
  @Post()
  async createOrderTrack(@Body() orderTrackDto) {
    console.log(await this.orderTrackService.create(orderTrackDto));
  }
}
