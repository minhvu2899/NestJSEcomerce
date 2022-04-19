import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { Order } from './../orders/order.entity';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from 'src/comments/comment.entity';
import { Address } from 'src/addresses/address.entity';
import { Payment } from 'src/orders/payment.entity';
import { WistList } from './../wishlist/wistlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column({ unique: true })
  @Expose()
  username: string;
  @Column()
  @Expose()
  first_name: string;
  @Column()
  @Expose()
  last_name: string;
  @Column({ unique: true })
  @Expose()
  email: string;
  @Column({ nullable: true })
  @Expose()
  phone_number: string;
  @Column({ nullable: true })
  @Exclude()
  password: string;
  @Column({ nullable: true })
  @Expose()
  avatar: string;
  @Column({ default: true })
  @Expose()
  isActive: boolean;
  @Column({ nullable: true })
  @Exclude()
  resetPassWordToken: string;
  // @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  // tasks: Task[];
  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];
  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];
  @OneToMany(() => WistList, (wistlist) => wistlist.user, { cascade: true })
  wistlists: WistList[];
  @Expose()
  get full_name(): string {
    return this.last_name + ' ' + this.first_name;
  }
}
