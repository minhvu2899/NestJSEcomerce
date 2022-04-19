import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './city.entity';
import { Ward } from './ward.entity';
//Quận Huyện
@Entity('tbl_district')
export class District {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Expose()
  @Column()
  name: string;

  @Column()
  type: string;

  @Expose()
  @ManyToOne(() => City, (city) => city.districts)
  @JoinColumn({ name: 'city_id' })
  city: City;
  @Expose()
  @OneToMany(() => Ward, (ward) => ward.district)
  wards: Ward[];
}
