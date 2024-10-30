import { Request } from 'express'
// import AuthServices from '../../services/AuthServices'
import { User } from '../../entities/user.entity'
import { AppDataSource } from '../../data-source'
import AuthServices from '../../services/AuthServices'

describe('AuthServices', () => {
  let mockUserRepository: {
    findOne: jest.Mock
    create: jest.Mock
    save: jest.Mock
  }

  beforeAll(async () => {
    await AppDataSource.initialize()
  })

  beforeEach(() => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    }
    
    ;(AuthServices as any).userRepository = mockUserRepository
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const name = 'Test User'

      mockUserRepository.findOne.mockResolvedValue(null) // Simulate user not existing
      mockUserRepository.create.mockReturnValue({ email, password, name })
      mockUserRepository.save.mockResolvedValue({ id: 1, email, name })

      const user = await AuthServices.register(email, password, name)
      expect(user).toBeInstanceOf(User)
      expect(user.email).toBe(email)
      expect(mockUserRepository.save).toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('should log in a user', async () => {
      const email = 'test@example.com'
      const password = 'password123'
      const mockUser = {
        id: 1,
        email,
        validatePassword: jest.fn().mockResolvedValue(true),
      }

      mockUserRepository.findOne.mockResolvedValue(mockUser)

      const user = await AuthServices.login(email, password)
      expect(user).toBe(mockUser)
      expect(mockUser.validatePassword).toHaveBeenCalledWith(password)
    })

    it('should throw an error for invalid email or password', async () => {
      const email = 'test@example.com'
      const password = 'wrongPassword'
      mockUserRepository.findOne.mockResolvedValue(null) // User not found

      await expect(AuthServices.login(email, password)).rejects.toThrow(
        'Invalid email or password',
      )
    })
  })

  describe('getUserProfile', () => {
    it('should return the user profile', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'validToken' },
      }
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' }

      // Mock the extractUserIdFromToken function
      ;(AuthServices as any).extractUserIdFromToken = jest
        .fn()
        .mockResolvedValue(mockUser.id)
      mockUserRepository.findOne.mockResolvedValue(mockUser)

      const userProfile = await AuthServices.getUserProfile(mockRequest)
      expect(userProfile).toEqual(mockUser)
    })

    it('should return null if user is not found', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'validToken' },
      }

      ;(AuthServices as any).extractUserIdFromToken = jest
        .fn()
        .mockResolvedValue(1)
      mockUserRepository.findOne.mockResolvedValue(null)

      const userProfile = await AuthServices.getUserProfile(mockRequest)
      expect(userProfile).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'validToken' },
        body: {
          name: 'Updated User',
          email: 'updated@example.com',
          password: 'newPassword123',
        },
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        save: jest.fn(),
      }

      ;(AuthServices as any).extractUserIdFromToken = jest
        .fn()
        .mockResolvedValue(mockUser.id)
      mockUserRepository.findOne.mockResolvedValue(mockUser)
      mockUserRepository.save.mockResolvedValue({
        ...mockUser,
        ...mockRequest.body,
      })

      const updatedUser = await AuthServices.updateProfile(mockRequest)
      expect(updatedUser).toEqual({ ...mockUser, ...mockRequest.body })
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser)
    })

    it('should throw an error if user not found', async () => {
      const mockRequest = {
        cookies: { refreshToken: 'validToken' },
        body: {},
      }

      ;(AuthServices as any).extractUserIdFromToken = jest
        .fn()
        .mockResolvedValue(1)
      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(AuthServices.updateProfile(mockRequest)).rejects.toThrow(
        'User not found',
      )
    })
  })
})
