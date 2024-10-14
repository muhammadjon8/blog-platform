import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm'
import bcrypt from 'bcrypt'
import { Blog } from './blog.entity'

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

  @BeforeInsert()
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
