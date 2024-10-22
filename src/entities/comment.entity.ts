// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Blog } from './blog.entity'
import { User } from './user.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: Blog

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
}
