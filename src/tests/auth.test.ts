import bcrypt from 'bcryptjs'
import { User } from '../entities/user.entity'

jest.mock('bcryptjs') // Mock bcrypt to avoid actual hashing during tests

describe('User Entity', () => {
  it('should hash password before saving', async () => {
    const user = new User()
    user.password = 'plainPassword'

    // Mock bcrypt.hash to return a hashed password
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword') // Remove the semicolon
    3
    await user.hashPassword() // Call the hashPassword method

    expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10)
    expect(user.password).toBe('hashedPassword')
  })

  it('should validate password correctly', async () => {
    const user = new User()
    user.password = 'hashedPassword'

    // Mock bcrypt.compare to resolve to true (indicating a valid password)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    const isValid = await user.validatePassword('plainPassword')

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'plainPassword',
      'hashedPassword',
    )
    expect(isValid).toBe(true)
  })
})
