import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { ProductsService } from 'src/products/products.service';
import { AddToCartDto } from './add-to-cart.dto';
import { CartService } from './cart.service';
import { InjectRepository } from '@nestjs/typeorm';
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('carts')
export class CartController {
  constructor(
    private cartsService: CartService,
    private productsService: ProductsService,
  ) {}
  @Get()
  getCartByUser(@GetUser() user) {
    return this.cartsService.getCartById(user);
  }
  @Post()
  async addToCart(@GetUser() user, @Body() addtocart: AddToCartDto) {
    const { product_id, quantity, variant_id } = addtocart;
    const product = await this.productsService.findOne(product_id);
    let data;
    if (variant_id) {
      const variant = { id: variant_id };
      data = {
        product,
        user,
        variant,
      };
    } else {
      data = {
        product,
        user,
      };
    }
    const item = await this.cartsService.findOne(data);
    console.log(item);
    if (item) {
      item.quantity = item.quantity + quantity;
      console.log(item.quantity);
      return this.cartsService.updateToCart(item);
    }
    return this.cartsService.addToCart(addtocart, user);
  }
  @Patch('/:id')
  async updateQuantity(
    @GetUser() user,
    @Body('quantity') quantity,
    @Param('id') id,
  ) {
    return this.cartsService.updateQuantity(id, quantity, user);
  }
  @Delete('/:id')
  removeToCart(@GetUser() user, @Param('id') id: string) {
    const product = this.cartsService.remove(id, user);
    return product;
  }
}
