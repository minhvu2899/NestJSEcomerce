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
} from '@nestjs/common';
import { ColorsService } from './color.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { SizesService } from './size.service';

@Controller('options')
export class ProductOptionController {
  constructor(
    private colorsService: ColorsService,
    private sizesService: SizesService,
  ) {}

  @Get('/colors')
  async getAllColor() {
    return this.colorsService.all();
  }
  @Get('/sizes')
  async getAllSize() {
    return this.sizesService.all();
  }
  //   @Post()
  //   createProduct(@Body() createProduct: CreateProductDto) {
  //     return this.productsService.createProduct(createProduct);
  //   }
  //   @Get('/:id')
  //   getProductByID(@Param('id') id: string) {
  //     return this.productsService.getProductById(id);
  //   }
  //   @Patch('/:id')
  //   updateProduct(
  //     @Body() updateProduct: UpdateProductDto,
  //     @Param('id') id: string,
  //   ) {
  //     return this.productsService.updateProduct(id, updateProduct);
  //   }
  //   @Delete('/:id')
  //   deleteProduct(@Param('id') id: string) {
  //     return this.productsService.delete(id);
  //   }
}
