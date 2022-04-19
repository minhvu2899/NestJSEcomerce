import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './attribute.entity';
import { CategoryAttribute } from './category-attribute.entity';
import { Category } from './category.entity';
import { CategorysController } from './categorys.controller';
import { CategorysService } from './categorys.service';
import { SubCategorysController } from './sub-categorys.controller';
import { SubCategorysService } from './sub-categorys.service';
import { SubCategory } from './subcategory.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      SubCategory,
      Attribute,
      CategoryAttribute,
    ]),
  ],

  controllers: [CategorysController, SubCategorysController],
  providers: [CategorysService, SubCategorysService],
  exports: [CategorysService, SubCategorysService],
})
export class CategorysModule {}
