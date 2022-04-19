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
import { Attribute } from './../categories/attribute.entity';
import { ProductAttributes } from './product_attributes.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column()
  @Expose()
  name: string;
  @Column({ nullable: true, default: 0 })
  @Expose()
  originalPrice: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  cost: number;
  @Column({ nullable: true, name: 'discount_percent', default: 0 })
  @Expose()
  discountPercent: number;
  @Column({ default: false })
  @Expose()
  isFreeShip: boolean;
  @Column()
  @Expose()
  image: string;
  @Column({ nullable: true, default: 0 })
  @Expose()
  length: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  width: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  height: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  weight: number;
  @Column({ default: false })
  @Expose()
  isActive: boolean;
  @Column()
  @Expose()
  short_description: string;
  @Column()
  @Expose()
  full_description: string;
  @Column({ nullable: true })
  @Expose()
  countInStock: number;
  @Column('tsvector', { select: false, nullable: true })
  product_tvc: any;
  @Column('tsvector', { select: false, nullable: true })
  product_tsv: any;
  @Column({ default: 0 })
  @Expose()
  sold: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  countRate: number;
  @Column({ nullable: true, default: 0 })
  @Expose()
  averageRate: number;

  @Column({ default: new Date() })
  @Expose()
  created_at: Date;
  @Expose()
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  @Expose()
  category: Category;
  @Expose()
  @ManyToOne(() => SubCategory, (subcategory) => subcategory.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: SubCategory;
  @Expose()
  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
  @Expose()
  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    cascade: true,
  })
  cart_items: CartItem[];
  @Expose()
  @OneToMany(() => Variants, (variants) => variants.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  variants: Variants[];
  @Expose()
  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];
  @Expose()
  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];
  @Expose()
  @OneToMany(
    () => ProductAttributes,
    (product_attributes) => product_attributes.product,
    { cascade: true },
  )
  attributes: ProductAttributes[];
  @Expose()
  get isPromotion(): boolean {
    return this.discountPercent > 0 ? true : false;
  }
  @Expose()
  get isInStock(): boolean {
    return this.countInStock > 0 ? true : false;
  }
  @Expose()
  get salePrice(): number {
    return this.discountPercent > 0
      ? Math.ceil(
          this.originalPrice -
            (this.originalPrice * this.discountPercent) / 100,
        )
      : this.originalPrice;
  }
  @Expose()
  get minPrice(): number {
    let min = 9999999999999;
    if (this.variants?.length > 0) {
      this.variants?.map((e) => {
        if (e.salePrice < min) {
          min = e.salePrice;
        }
      });
      return min;
    }
    return this.salePrice;
  }
  @Expose()
  get maxPrice(): number {
    let max = 0;
    if (this.variants?.length > 0) {
      this.variants.map((e) => {
        if (e.salePrice > max) {
          max = e.salePrice;
        }
      });
      return max;
    }
    return this.salePrice;
  }
}
