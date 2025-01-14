import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text', { default: 'General' })
  category: string;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate: Date;

  @Column({ default: false })
  sharedTask: boolean;

  @Column('text', { default: 'General' })
  sharedUser: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
}
