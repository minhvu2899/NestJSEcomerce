import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/category.entity';
import { SubCategory } from 'src/categories/subcategory.entity';
import { ProductAttributes } from '../product_attributes.entity';
import { TypeVariant } from '../TypeVariant.enum';
import { Variants } from '../variants.entity';
import { Brand } from './../../brands/brand.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  originalPrice: number;

  cost: number;

  discountPercent: number;

  isFreeShip: boolean;

  image: string;

  length: number;

  width: number;

  height: number;

  weight: number;

  isActive: boolean;

  short_description: string;

  full_description: string;

  countInStock: number;

  // type_variant: TypeVariant;
  created_at: Date;
  category?: Category;
  subcategory?: SubCategory;
  brand?: Brand;
  attributes?: ProductAttributes[];
  variants?: Variants[];
}
