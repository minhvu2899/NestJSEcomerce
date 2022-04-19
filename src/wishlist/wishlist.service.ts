import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WistList } from './wistlist.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WistList)
    private wistlistRepository: Repository<WistList>,
  ) {}
  async addToWistList(user, productID) {
    const wistList = this.wistlistRepository.create({
      user,
      product: productID,
    });
    return await this.wistlistRepository.save(wistList);
  }
  async getAll(user, relations = []) {
    return await this.wistlistRepository.find({
      where: { user },
      relations,
    });
  }
  async removeFromWistList(user, id) {
    const wistList = await this.wistlistRepository.findOne({
      id,
    });
    if (!wistList) {
      throw new NotFoundException('WistList not found');
    }
    return await this.wistlistRepository.remove(wistList);
  }
}
