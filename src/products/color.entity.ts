import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Variants } from './variants.entity';
@Entity()
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  code: string;
  @OneToMany(() => Variants, (variants) => variants.color, { cascade: true })
  variants: Variants[];
}
