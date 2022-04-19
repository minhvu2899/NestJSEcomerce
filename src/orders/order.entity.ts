import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Exclude, Expose } from 'class-transformer';
import { PaymentMethods } from './payment-methods.enum';
import { OrderStatus } from './order-status.enum';
import { User } from 'src/users/user.entity';
import { Payment } from './payment.entity';
import { OrderTrack } from '../order-track/order-track.entity';
import { Coupon } from 'src/coupon/coupon.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: number;
  @Column()
  @Expose()
  full_name: string;
  @Column()
  @Expose()
  email: string;
  @CreateDateColumn()
  @Expose()
  created_at: Date;

  @Column()
  @Expose()
  phone_number: string;
  @Column({ nullable: true })
  @Expose()
  bill_code: string;
  @Column({ nullable: true })
  @Expose()
  coupon_value: number;
  @Column({ default: 0 })
  @Expose()
  product_cost: number;
  @CreateDateColumn({ type: 'date', nullable: true })
  @Expose()
  order_date: Date;
  @Expose()
  @Column()
  shipping_address: string;
  @Expose()
  @Column()
  payment_method: PaymentMethods;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  @Expose()
  order_status: OrderStatus;
  @Expose()
  @Column({ default: false, nullable: true })
  is_paid: boolean;
  @Column({ nullable: true })
  @Expose()
  paid_at: Date;
  @Expose()
  @Column({ default: false, nullable: true })
  is_delivered: boolean;
  @Column({ nullable: true })
  delivered_at: Date;
  @Column()
  feeship: number;
  @Expose()
  @Column()
  total: number;
  @Expose()
  @OneToMany(() => Comment, (comment) => comment.order)
  comments: Comment[];
  @Expose()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  order_items: OrderItem[];
  @Expose()
  @OneToMany(() => OrderTrack, (orderTrack) => orderTrack.order, {
    cascade: true,
  })
  order_tracks: OrderTrack[];
  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ nullable: true })
  @Expose()
  coupon_code: string;
  @Expose()
  get subtotal(): number {
    return this.order_items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  }
}
