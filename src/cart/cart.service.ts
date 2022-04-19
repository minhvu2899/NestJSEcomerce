import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './../products/products.entity';
import { User } from 'src/users/user.entity';
import { AddToCartDto } from './add-to-cart.dto';
import { Variants } from 'src/products/variants.entity';
@Injectable()
export class CartService extends AbstractService {
  constructor(
    @InjectRepository(CartItem) private cartsRepository: Repository<CartItem>,
  ) {
    super(cartsRepository);
  }
  async getCartById(user) {
    const data = await this.cartsRepository.find({ user });
    return data;
  }

  async addToCart(data: AddToCartDto, user: User) {
    const { product_id, variant_id, quantity } = data;
    const cartItem = this.cartsRepository.create({
      user: { id: user.id },
      product: { id: product_id },
      variant: variant_id ? { id: variant_id } : null,
      quantity,
    });
    return await this.cartsRepository.save(cartItem);
  }
  async updateToCart(item) {
    return await this.cartsRepository.save(item);
  }
  async updateQuantity(id, quantity, user) {
    const cartItem = await this.cartsRepository.findOne({ id, user });
    if (!cartItem) {
      throw new NotFoundException('Product not found');
    }
    cartItem.quantity = +quantity;
    return await this.cartsRepository.save(cartItem);
  }
  async remove(id, user): Promise<string> {
    const cartItem = await this.cartsRepository.findOne({ id, user });
    if (!cartItem) {
      throw new NotFoundException('Product not found');
    }
    await this.cartsRepository.remove(cartItem);
    return id;
  }
}
