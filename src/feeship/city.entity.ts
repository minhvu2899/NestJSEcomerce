import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { District } from './district.entity';
//Tỉnh thành phố
@Entity('tbl_city')
export class City {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;
  @Expose()
  @Column()
  name: string;

  @Column()
  type: string;

  @Expose()
  @OneToMany(() => District, (district) => district.city)
  districts: District[];
}
