import { Vote } from '../../votes/entities/vote.entity';
import { Message } from '../../messages/entities/message.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_name', unique: true, length: 100 })
  userName: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 500 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
