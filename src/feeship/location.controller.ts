import { Controller, Get, Query } from '@nestjs/common';
import { FeeshipService } from './feeship.service';

@Controller('location')
export class LocationController {
  constructor(private feeService: FeeshipService) {}
  @Get('/city')
  getListCity() {
    return this.feeService.getListCity();
  }
  @Get('/district')
  getListDistrictByCity(@Query('city') city) {
    return this.feeService.getListDistrictByCity(city);
  }
  @Get('/ward')
  getListWardByDistrict(@Query('district') district) {
    return this.feeService.getListWardByDistrict(district);
  }
}
