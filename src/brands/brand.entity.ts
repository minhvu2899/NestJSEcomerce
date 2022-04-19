import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Product } from 'src/products/products.entity';
import { User } from 'src/users/user.entity';
import { Variants } from 'src/products/variants.entity';
import { Category } from 'src/categories/category.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column()
  @Expose()
  logo: string;
  @Column()
  @Expose()
  name: string;
  @Column({ nullable: true })
  @Expose()
  slug: string;
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
  @Expose()
  @ManyToMany(() => Category, { cascade: true })
  @JoinTable({
    name: 'brands_categories',
    joinColumn: { name: 'brand_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
