import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}
  async getAll(): Promise<Brand[]> {
    const brands = await this.brandRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.categories', 'categories')
      .leftJoinAndSelect('categories.subcategory', 'subcategory')
      // .orderBy('order_tracks.created_at', 'DESC')
      // .where('o.id =:orderID', { orderID: id })
      .getMany();
    return brands;
    // return this.brandRepository.find({ relations: ['categories'] });
  }
  async getBrandById(id: string) {
    const brand = await this.brandRepository.findOne(id, {
      relations: ['categories'],
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }
  async createBrand(brandDto) {
    const brand = this.brandRepository.create({
      ...brandDto,
    });
    return await this.brandRepository.save(brand);
  }
  async updateBrand(id, brandDto) {
    const brand = await this.brandRepository.findOne(id);
    if (!brand) {
      throw new NotFoundException('Address not found');
    }
    const newAddress = this.brandRepository.create({
      ...brand,
      ...brandDto,
    });
    return await this.brandRepository.save(newAddress);
  }
  async deleteBrand(id: string) {
    const brand = this.getBrandById(id);
    if (brand) {
      await this.brandRepository.delete(id);
    }
  }
}
