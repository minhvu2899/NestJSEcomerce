import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { Order } from './../orders/order.entity';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from 'src/comments/comment.entity';
import { Address } from 'src/addresses/address.entity';
import { Payment } from 'src/orders/payment.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/products.entity';

@Entity()
export class WistList {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @ManyToOne(() => User, (user) => user.wistlists)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
