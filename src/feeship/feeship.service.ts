import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './city.entity';
import { Repository } from 'typeorm';
import { District } from './district.entity';
import { Ward } from './ward.entity';
import { FeeShip } from './feeship.entity';
@Injectable()
export class FeeshipService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward) private wardRepository: Repository<Ward>,
    @InjectRepository(FeeShip) private feeshipRepository: Repository<FeeShip>,
  ) {}
  async getListCity(): Promise<City[]> {
    return await this.cityRepository.find();
  }
  async getListDistrictByCity(city: number) {
    return await this.districtRepository.find({ where: { city: city } });
  }
  async getListWardByDistrict(district) {
    return await this.wardRepository.find({ where: { district: district } });
  }
  getAll(): Promise<FeeShip[]> {
    return this.feeshipRepository.find({});
  }
  async getFeeShipById(id: string) {
    const feeship = await this.feeshipRepository.findOne(id);
    if (!feeship) {
      throw new NotFoundException('feeship not found');
    }
    return feeship;
  }
  async createFeeShip(createFeeShipDto) {
    console.log(createFeeShipDto);
    const feeship = this.feeshipRepository.create({
      ...createFeeShipDto,
    });
    console.log(feeship);
    return await this.feeshipRepository.save(feeship);
  }
  async updateFeeShip(id, feeshipDto) {
    const feeship = await this.getFeeShipById(id);

    feeship.city = feeshipDto.city;
    feeship.district = feeshipDto.district;
    feeship.ward = feeshipDto.ward;

    feeship.feeship = feeshipDto.feeship;
    return await this.feeshipRepository.save(feeship);
  }
  async deleteFeeShip(id: string) {
    const feeship = this.getFeeShipById(id);
    if (feeship) {
      await this.feeshipRepository.delete(id);
    }
  }
  async getFeeShip(city, district, ward) {
    const feeship = await this.feeshipRepository.findOne({
      city,
      district,
      ward,
    });
    if (!feeship) {
      throw new NotFoundException('feeship not found');
    }
    return feeship.feeship;
  }
}
