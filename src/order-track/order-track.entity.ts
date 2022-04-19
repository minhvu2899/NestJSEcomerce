import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../orders/order-status.enum';
import { Order } from './../orders/order.entity';

@Entity('order_track')
export class OrderTrack {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Expose()
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;
  @Expose()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;
  @Expose()
  @Column()
  description: string;
  // @Expose()
  @ManyToOne(() => Order, (order) => order.order_tracks, { eager: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
