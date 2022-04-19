import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Variants } from './variants.entity';
@Entity()
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  code: string;
  @OneToMany(() => Variants, (variants) => variants.size, { cascade: true })
  variants: Variants[];
}
