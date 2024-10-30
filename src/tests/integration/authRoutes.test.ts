import request from 'supertest'
import app from '../../app'
import { AppDataSource } from '../../data-source'

beforeAll(async () => {
  await AppDataSource.initialize()
})

afterAll(async () => {
  await AppDataSource.destroy()
})

describe('Auth Routes', () => {
  describe('/signup', () => {
    it('should successfully create a new user', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('token')
    })

    it('should return an error for existing user', async () => {
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message', 'User already exists')
    })
  })

  describe('/login', () => {
    it('should login successfully with correct credentials', async () => {
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'loginuser@example.com',
          password: 'password123',
          name: 'Login User',
        })

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'loginuser@example.com', password: 'password123' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wronguser@example.com', password: 'wrongpassword' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty(
        'message',
        'Invalid email or password',
      )
    })
  })
})

