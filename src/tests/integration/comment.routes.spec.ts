import request from 'supertest'
import { AppDataSource } from '../../data-source'
import app from '../../app'


describe('Comment Routes', () => {
  let token: string

  beforeAll(async () => {
    // Initialize the database connection before tests run
    await AppDataSource.initialize()
    token = 'mockToken' // replace with logic to generate or mock an auth token if needed
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  it('should create a new comment', async () => {
    const response = await request(app)
      .post('/api/blogs/1/comments')
      .set('Cookie', `refreshToken=${token}`)
      .send({ content: 'Test comment' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.content).toBe('Test comment')
  })

  it('should fetch comments for a blog', async () => {
    const response = await request(app)
      .get('/api/blogs/1/comments')
      .set('Cookie', `refreshToken=${token}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should update a comment', async () => {
    const response = await request(app)
      .put('/api/blogs/1/comments/1')
      .set('Cookie', `refreshToken=${token}`)
      .send({ content: 'Updated content' })

    expect(response.status).toBe(200)
    expect(response.body.content).toBe('Updated content')
  })

  it('should delete a comment', async () => {
    const response = await request(app)
      .delete('/api/blogs/1/comments/1')
      .set('Cookie', `refreshToken=${token}`)

    expect(response.status).toBe(204)
  })
})
