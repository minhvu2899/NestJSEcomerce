import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './products.entity';
@Entity({ name: 'product_images' })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  title: string;
  @Column()
  image: string;
  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
