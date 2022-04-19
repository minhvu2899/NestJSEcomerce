import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from '../comments/comment.entity';
@Entity()
export class Reply {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column()
  reply: string;

  @Expose()
  @CreateDateColumn()
  create_at: Date;

  @Expose()
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Expose()
  @OneToOne(() => Comment, (comment) => comment.reply, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: Comment;
}
export enum CommentStatus {}
