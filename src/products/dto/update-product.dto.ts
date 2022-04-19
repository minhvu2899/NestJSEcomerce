import { Brand } from 'src/brands/brand.entity';
import { ProductAttributes } from '../product_attributes.entity';
import { Variants } from './../variants.entity';
export class UpdateProductDto {
  name?: string;
  originalPrice?: number;
  salePrice?: number;
  promotionPercent?: number;
  isFreeShip?: boolean;
  isPromotion?: boolean;
  variants?: Variants[];
  brand?: Brand;
  attributes?: ProductAttributes[];
  isActive?: boolean;
  countInStock?: number;
  sold?: number;
}
