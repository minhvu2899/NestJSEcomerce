import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { ProductsService } from './products.service';
import { Variants } from './variants.entity';
import { Color } from './color.entity';
import { Size } from './size.entity';
import { Image } from './image.entity';
import { Comment } from '../comments/comment.entity';
import { SizesService } from './size.service';
import { ColorsService } from './color.service';
import { ProductOptionController } from './product-options.controller';
import { ProductAttributes } from './product_attributes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Variants,
      Color,
      Size,
      Image,
      ProductAttributes,
    ]),
  ],
  controllers: [ProductsController, ProductOptionController],
  providers: [ProductsService, ColorsService, SizesService],
  exports: [ProductsService, ColorsService, SizesService],
})
export class ProductsModule {}
