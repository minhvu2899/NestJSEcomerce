import { Module } from '@nestjs/common';
import { FeeshipService } from './feeship.service';
import { FeeshipController } from './feeship.controller';
import { FeeShip } from './feeship.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './district.entity';
import { Ward } from './ward.entity';
import { City } from './city.entity';
import { LocationController } from './location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeeShip, City, District, Ward])],
  providers: [FeeshipService],
  controllers: [FeeshipController, LocationController],
})
export class FeeshipModule {}
