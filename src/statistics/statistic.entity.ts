import { Expose, Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('statistic')
export class Statistic {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Expose()
  @Column({
    type: 'date',
    // type: 'timestamptz',
    nullable: true,
  })
  order_date: Date;
  @Column({ nullable: true })
  gross_sale: number;
  @Column({ nullable: true })
  net_sale: number;
  @Column()
  total_order: number;
}
