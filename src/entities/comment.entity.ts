// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Blog } from './blog.entity'
import { User } from './user.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'userId' })
  author: User

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blogId' })
  blog: Blog

  @CreateDateColumn()
  createdAt: Date
}
