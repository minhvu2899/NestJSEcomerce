import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Address } from './address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}
  getAll(user: User): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: user },
    });
  }
  async getAddressById(id: string) {
    const address = await this.addressRepository.findOne(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }
  async createAddress(createAddressDto, user) {
    console.log(createAddressDto);
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    console.log(address);
    return await this.addressRepository.save(address);
  }
  async updateAddress(id, addressDto) {
    const address = await this.addressRepository.findOne(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    address.city = addressDto.city;
    address.address = addressDto.address;
    address.district = addressDto.district;
    address.ward = addressDto.ward;
    address.defaultAddress = addressDto.default_address;
    address.name = addressDto.name;
    address.phone_number = addressDto.phone_number;
    return await this.addressRepository.save(address);
  }
  async deleteAddress(id: string) {
    const address = this.getAddressById(id);
    if (address) {
      await this.addressRepository.delete(id);
    }
  }
}
