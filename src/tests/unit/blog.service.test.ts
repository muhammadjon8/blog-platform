
import { Request } from 'express'
import { AppDataSource } from '../../data-source'
import blogsServices from '../../services/blogs.services'
import { Blog } from '../../entities/blog.entity'

describe('BlogServices Unit Tests', () => {
  beforeAll(async () => {
    await AppDataSource.initialize()
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  test('createBlog - success', async () => {
    const req = {
      cookies: { refreshToken: 'mockToken' },
    } as unknown as Request

    const mockBlogDto = {
      title: 'Test Blog',
      content: 'Test Content',
      tags: ['test'],
    }

    const blog = await blogsServices.createBlog(req, mockBlogDto)

    expect(blog).toBeInstanceOf(Blog)
    expect(blog.title).toBe(mockBlogDto.title)
  })

  test('updateBlog - throws error when blog not found', async () => {
    const req = { cookies: { refreshToken: 'mockToken' } } as unknown as Request
    await expect(
      blogsServices.updateBlog(req, 9999, 'Title', 'Content'),
    ).rejects.toThrow('Blog not found')
  })

  test('deleteBlog - throws error when unauthorized', async () => {
    const req = { cookies: { refreshToken: 'mockToken' } } as unknown as Request
    await expect(blogsServices.deleteBlog(req, 9999)).rejects.toThrow(
      'Blog not found',
    )
  })
})
