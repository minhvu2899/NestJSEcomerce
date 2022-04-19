import { Product } from 'src/products/products.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { SubCategory } from './subcategory.entity';
import { CategoryAttribute } from './category-attribute.entity';
@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  slug: string;
  @Column()
  description: string;
  @Column({ default: false })
  isActive: boolean;
  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];
  @OneToMany((type) => SubCategory, (sub) => sub.category)
  subcategory: SubCategory[];
  // @ManyToMany(() => Attribute, { cascade: true })
  // @JoinTable({
  //   name: 'category_attribute',
  //   joinColumn: { name: 'category_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'attribute_id', referencedColumnName: 'id' },
  // })
  // category_attributes: Attribute[];
  @OneToMany((type) => CategoryAttribute, (ct) => ct.category)
  category_attributes: CategoryAttribute[];
}
