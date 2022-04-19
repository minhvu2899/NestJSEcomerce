import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Product } from 'src/products/products.entity';
import { User } from 'src/users/user.entity';
import { Variants } from 'src/products/variants.entity';

@Entity('cart-items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: number;
  @Column()
  @Expose()
  quantity: number;
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  @Expose()
  // @Transform(({ value }) => value.id)
  product: Product;
  @ManyToOne(() => Variants, { eager: true, nullable: true })
  @JoinColumn({ name: 'variant_id' })
  @Expose()
  // @Transform(({ value }) => (value?.id ? value.id : null))
  variant: Variants;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @Transform(({ value }) => value.id)
  user: User;
}
