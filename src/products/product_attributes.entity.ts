import { Expose } from 'class-transformer';
import { CartItem } from 'src/cart/cart-item.entity';
import { Category } from 'src/categories/category.entity';
import { SubCategory } from 'src/categories/subcategory.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Image } from './image.entity';
import { TypeVariant } from './TypeVariant.enum';
import { Variants } from './variants.entity';
import { Comment } from '../comments/comment.entity';
import { Brand } from 'src/brands/brand.entity';
import { Attribute } from '../categories/attribute.entity';
import { Product } from 'src/products/products.entity';
@Entity('product_attributes')
export class ProductAttributes {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  value: string;
  // @Column({ nullable: true })
  // attribute_name: string;

  @ManyToOne(() => Product, (product) => product.attributes)
  @JoinColumn({ name: 'product_id' })
  @Expose()
  product: Product;
  @Expose()
  @ManyToOne(() => Attribute, (attribute) => attribute.product_attributes, {
    eager: true,
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;
  // @Column({ nullable: true })
  // attribute_id: string;
}
