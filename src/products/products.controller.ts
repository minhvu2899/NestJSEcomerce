import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Put,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { InjectRepository } from '@nestjs/typeorm';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get('/search')
  searchProduct(@Query('s') s: string) {
    return this.productsService.searchProduct(s);
  }
  @Get()
  // async all(@Query() options?: FilterProductDto) {
  //   return this.productsService.paginate(options, [
  //     'category',
  //     'subcategory',
  //     'variants',
  //     'comments',
  //   ]);
  // }
  async all(@Query() options?: FilterProductDto) {
    return this.productsService.getProduct(options, [
      'category',
      'subcategory',
      'variants',
      'comments',
    ]);
  }
  @Post('/color-size')
  getColorSize(@Body() ProductDto) {
    return this.productsService.getSizeColor(ProductDto);
  }
  @Post()
  createProduct(@Body() createProduct: CreateProductDto) {
    return this.productsService.createProduct(createProduct);
  }
  @Get('/:id')
  getProductByID(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
  @Patch('/:id')
  updateProduct(
    @Body() updateProduct: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return this.productsService.updateProduct(id, updateProduct);
  }
  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
