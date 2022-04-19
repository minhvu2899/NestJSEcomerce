import { Expose } from 'class-transformer';
import { Product } from 'src/products/products.entity';
import { Variants } from 'src/products/variants.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_title: string;

  @Column()
  price: number;

  @Column()
  quantity: number;
  @Column({ nullable: true })
  variant_id: string;
  @Column()
  product_id: string;
  @Column({ nullable: true })
  image: string;
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  @Expose()
  product: Product;
  @ManyToOne(() => Variants, { eager: true, nullable: true })
  @JoinColumn({ name: 'variant_id' })
  @Expose()
  variant: Variants;
  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
