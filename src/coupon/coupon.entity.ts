import { Expose } from 'class-transformer';
import { Order } from 'src/orders/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_coupon')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: number;
  @Expose()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;
  @Column()
  name: string;
  @Column()
  date_start: Date;
  @Column()
  date_end: Date;
  @Column({ unique: true })
  coupon_code: string;
  @Column({ default: 0 })
  status: string;
  @Column()
  usage_quantity: number;
  @Column()
  value: number;
  @Column()
  min_price: number;
  @Column({ default: 0 })
  used: number;
  @Column()
  type: number;

  // @OneToMany(() => Order, {
  //   cascade: true,
  // })
  // orders: Order[];
}
