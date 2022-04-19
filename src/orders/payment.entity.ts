import { Expose } from 'class-transformer';
import { Product } from 'src/products/products.entity';
import { Variants } from 'src/products/variants.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payment_method: string;
  @Column()
  tran_id: string;

  @Column()
  amount_paid: number;
  @Column()
  status: string;
  @Column()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.payments, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @Expose()
  user: User;

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
