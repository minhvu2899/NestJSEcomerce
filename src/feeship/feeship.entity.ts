import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from '../orders/order-status.enum';
import { Order } from './../orders/order.entity';
import { City } from './city.entity';
import { District } from './district.entity';
import { Ward } from './ward.entity';

@Entity('tbl_feeship')
export class FeeShip {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: number;
  @Expose()
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;
  @Column()
  feeship: number;
  @Expose()
  @OneToOne((type) => City, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;
  @OneToOne((type) => District, { eager: true })
  @JoinColumn({ name: 'district_id' })
  district: District;
  @OneToOne((type) => Ward, { eager: true })
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;
}
