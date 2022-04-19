import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeeshipService } from './feeship.service';

@Controller('feeship')
export class FeeshipController {
  constructor(private feeService: FeeshipService) {}
  @Get()
  getAll() {
    return this.feeService.getAll();
  }
  @Get('/charge')
  getFeeShip(
    @Query('city') city,
    @Query('district') district,
    @Query('ward') ward,
  ) {
    return this.feeService.getFeeShip(city, district, ward);
  }
  @Get('/:id')
  getFeeShipById(@Param('id') id: string) {
    return this.feeService.getFeeShipById(id);
  }
  @Post('')
  createFeeShip(@Body() createAddressDto) {
    return this.feeService.createFeeShip(createAddressDto);
  }
  @Patch('/:id')
  updateFeeShip(@Body() updateFeeShipDto, @Param('id') id: string) {
    return this.feeService.updateFeeShip(id, updateFeeShipDto);
  }
  @Delete('/:id')
  deteleFeeShip(@Param('id') id: string) {
    return this.feeService.deleteFeeShip(id);
  }
  @Get('/city')
  getListCity() {
    return this.feeService.getListCity();
  }
  @Get('/city')
  getListDistrictByCity() {
    return this.feeService.getListDistrictByCity(1);
  }
  @Get('/district')
  getListWardByDistrict() {
    return this.feeService.getListWardByDistrict(2);
  }
}
