import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTrackController } from './order-track.controller';
import { OrderTrack } from './order-track.entity';
import { OrderTrackService } from './order-track.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTrack])],
  controllers: [OrderTrackController],
  providers: [OrderTrackService],
})
export class OrderTrackModule {}
