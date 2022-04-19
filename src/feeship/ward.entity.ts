import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { District } from './district.entity';
//Xã phường
@Entity('tbl_ward')
export class Ward {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Expose()
  @Column()
  name: string;

  @Column()
  type: string;

  @Expose()
  @ManyToOne(() => District, (district) => district.wards)
  @JoinColumn({ name: 'district_id' })
  district: District;
}
