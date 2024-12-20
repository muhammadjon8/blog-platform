import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  BeforeUpdate,
} from 'typeorm'
import bcrypt from 'bcrypt'
import { Blog } from './blog.entity'
import { Comment } from './comment.entity'
import { Exclude } from 'class-transformer'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[]

  @Column({ default: false })
  isAdmin: boolean

  @Column({ default: 'user' })
  role: string

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]

  @ManyToMany(() => Blog, (blog) => blog.likes)
  @Exclude()
  likedBlogs: Blog[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (typeof this.password !== 'string') {
      throw new Error('Password must be a string')
    }
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }
}
