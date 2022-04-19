import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/products.entity';
import { Variants } from 'src/products/variants.entity';
import { Reply } from './../reply/reply.entity';
import { Order } from 'src/orders/order.entity';
@Entity()
export class Comment {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Expose()
  @Column({ nullable: true })
  subject: string;
  @Expose()
  @Column()
  comment: string;
  @Expose()
  @Column()
  rate: number;
  @Expose()
  @Column()
  @Expose()
  status: string;
  @Column()
  @Expose()
  create_at: Date;
  @Expose()
  @Column()
  update_at: Date;
  @Expose()
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Expose()
  @OneToOne(() => Reply, (reply) => reply.comment)
  reply: Reply;
  @Expose()
  @ManyToOne(() => Product, (product) => product.comments, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Expose()
  @ManyToOne(() => Order, (order) => order.comments)
  @JoinColumn()
  order: Order;
  @Expose()
  @ManyToOne(() => Variants, { eager: true })
  @JoinColumn({ name: 'variant_id' })
  @Transform(({ value }) => {
    if (value) {
      return { variant_name: value.size?.name + ',' + value.color?.name };
    }
  })
  variant: Variants;
}
export enum CommentStatus {}
