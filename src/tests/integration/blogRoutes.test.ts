import request from 'supertest'
import { AppDataSource } from '../../data-source'
import app from '../../app'


beforeAll(async () => {
  await AppDataSource.initialize()
})

afterAll(async () => {
  await AppDataSource.destroy()
})

describe('Blog Integration Tests', () => {
  let token: string

  beforeAll(async () => {
    // Register a test user and log in to get a token
    const testUser = { username: 'testuser', password: 'testpassword' }
    await request(app).post('/api/auth/register').send(testUser)
    const res = await request(app).post('/api/auth/login').send(testUser)
    token = res.body.token
  })

  test('Create Blog', async () => {
    const blogData = { title: 'Test Blog', content: 'Test Content' }
    const res = await request(app)
      .post('/api/blogs')
      .set('Cookie', `refreshToken=${token}`)
      .send(blogData)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data.title).toBe('Test Blog')
  })

  test('Get Blog by ID', async () => {
    const res = await request(app)
      .get('/api/blogs/1')
      .set('Cookie', `refreshToken=${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('title')
  })

  test('Update Blog', async () => {
    const updatedData = {
      title: 'Updated Blog Title',
      content: 'Updated Content',
    }
    const res = await request(app)
      .put('/api/blogs/1')
      .set('Cookie', `refreshToken=${token}`)
      .send(updatedData)

    expect(res.statusCode).toBe(200)
    expect(res.body.data.title).toBe('Updated Blog Title')
  })

  test('Delete Blog', async () => {
    const res = await request(app)
      .delete('/api/blogs/1')
      .set('Cookie', `refreshToken=${token}`)

    expect(res.statusCode).toBe(204)
  })
})
