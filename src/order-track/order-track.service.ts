import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderTrack } from './order-track.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderTrackService {
  constructor(
    @InjectRepository(OrderTrack)
    private orderTrackRepository: Repository<OrderTrack>,
  ) {}

  async create(orderTrack) {
    console.log(orderTrack);
    const order_track = this.orderTrackRepository.create({ ...orderTrack });
    return await this.orderTrackRepository.save(order_track);
  }
}
