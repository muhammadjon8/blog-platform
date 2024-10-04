import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import bcrypt from 'bcrypt'

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
