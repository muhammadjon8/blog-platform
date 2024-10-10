import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'

class AuthService {
  private userRepository = AppDataSource.getRepository(User)

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
}

export default new AuthService()
