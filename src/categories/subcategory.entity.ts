import { Product } from 'src/products/products.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Attribute } from './attribute.entity';
import { CategoryAttribute } from './category-attribute.entity';
@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  name: string;
  @Column()
  slug: string;
  @Column()
  description: string;
  @Column({ default: false })
  isActive: boolean;
  @ManyToOne((type) => Category, (category) => category.subcategory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
  @OneToMany((type) => Product, (product) => product.subcategory)
  products: Product[];
  @OneToMany((type) => CategoryAttribute, (ct) => ct.subcategory)
  category_attribute: CategoryAttribute[];
}
