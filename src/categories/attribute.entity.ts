import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductAttributes } from './../products/product_attributes.entity';
import { CategoryAttribute } from './category-attribute.entity';
@Entity()
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;

  @OneToMany(
    (type) => ProductAttributes,
    (product_attributes) => product_attributes.attribute,
  )
  product_attributes: ProductAttributes[];
  @OneToMany(
    (type) => CategoryAttribute,
    (category_attributes) => category_attributes.attribute,
  )
  category_attributes: CategoryAttribute[];
}
