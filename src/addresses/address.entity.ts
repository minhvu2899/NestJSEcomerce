import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  city: string;
  @Column()
  district: string;
  @Column()
  ward: string;
  @Column()
  phone_number: string;
  @Column({ nullable: true })
  address: string;
  @Column({ name: 'default_address', default: false })
  defaultAddress: boolean;
  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
