import { Expose, Transform } from 'class-transformer';
import { CartItem } from 'src/cart/cart-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Color } from './color.entity';
import { Product } from './products.entity';
import { Size } from './size.entity';
@Entity({ name: 'product_variants' })
export class Variants {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Expose()
  // @Column()
  // image: string;
  @Expose()
  @Column({ nullable: true })
  countInStock: number;
  @Column({ default: 0 })
  originalPrice: number;
  @Column({ nullable: true, default: 0 })
  cost: number;
  @Column({ nullable: true, name: 'discount_percent', default: 0 })
  discountPercent: number;
  @Expose()
  @ManyToOne(() => Product, (product) => product.variants, {
    eager: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  // @Expose()
  @Transform(({ value }) => value.id)
  product: Product;
  @Expose()
  @ManyToOne(() => Size, (size) => size.variants, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'size_id' })
  size: Size;
  @Expose()
  @ManyToOne(() => Color, (color) => color.variants, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'color_id' })
  // @Transform(({ value }) => value.id)
  color: Color;
  @OneToMany(() => CartItem, (cartItem) => cartItem.variant, { cascade: true })
  cart_items: CartItem[];
  @Expose()
  get salePrice(): number {
    return this.discountPercent > 0
      ? this.originalPrice - (this.originalPrice * this.discountPercent) / 100
      : this.originalPrice;
  }
  @Expose()
  get variant_name(): string {
    let name = '';
    if (this.color) {
      name += this.color.name;
    }
    if (this.color && this.size) {
      name += ',';
    }
    if (this.size) {
      name += this.size.name;
    }
    return name;
  }
}
