import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductAttributes } from './../products/product_attributes.entity';
import { Category } from './category.entity';
import { SubCategory } from 'src/categories/subcategory.entity';
import { Attribute } from './attribute.entity';
@Entity()
export class CategoryAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Category)
  category: Category;
  @ManyToOne((type) => SubCategory)
  subcategory: SubCategory;
  @ManyToOne((type) => Attribute, { eager: true })
  attribute: Attribute;
}
