import { Vote } from '../../votes/entities/vote.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', length: 100 })
  title: string;

  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_user_id' })
  author: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Vote, (vote) => vote.message, { cascade: true })
  votes: Vote[];
}
