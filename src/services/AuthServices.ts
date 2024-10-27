import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'
import { Request, Response } from 'express'
import CustomJwtPayload from '../utils/customJwtPayload'
import * as jwt from 'jsonwebtoken'
import { UpdateUserProfile } from '../dtos/update-user-profile.dto'

class AuthService {
  private userRepository = AppDataSource.getRepository(User)

  private async extractUserIdFromToken(req: Request): Promise<number> {
    const jwtSecret = process.env.JWT_SECRET || 'secret'

    const token = req.cookies?.refreshToken
    if (!token) {
      throw new Error('No refresh token found')
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload
      return decoded.userId
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async register(email: string, password: string, name: string) {
    const userExists = await this.userRepository.findOne({ where: { email } })
    if (userExists) throw new Error('User already exists')

    const user = this.userRepository.create({ email, password, name })
    return this.userRepository.save(user)
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) throw new Error('Invalid email or password')

    const validPassword = await user.validatePassword(password)
    if (!validPassword) throw new Error('Invalid email or password')

    return user
  }

  async changeUserRole(userId: number, role: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    user.role = role
    user.isAdmin = role === 'admin'
    return this.userRepository.save(user)
  }
  async getUserProfile(req: Request): Promise<User | null> {
    try {
      const userId = await this.extractUserIdFromToken(req)
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      console.error(error)
      return null
    }
  }
  async updateProfile(req: Request): Promise<User | null> {
    const userId = await this.extractUserIdFromToken(req)
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    const { name, email, password } = req.body
    if (name) user.name = name
    if (email) user.email = email
    if (password) user.password = password
    return this.userRepository.save(user)
  }
}

export default new AuthService()
