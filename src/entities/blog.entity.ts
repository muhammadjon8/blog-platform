import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from './user.entity'
import { Comment } from './comment.entity'

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'jsonb', nullable: true })
  tags: string[]

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author: User

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
