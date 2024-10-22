import { Blog } from '../entities/blog.entity'
import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'
import blogsServices from '../services/blogs.services'

jest.mock('../data-source')

describe('BlogService', () => {
  let blogRepo: any
  let userRepo: any

  beforeEach(() => {
    blogRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    }
    userRepo = {
      findOne: jest.fn(),
    }
    ;(AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Blog) return blogRepo
      if (entity === User) return userRepo
    })
  })

  test('should update blog when user is author', async () => {
    const userId = 1
    const blogId = 1
    const title = 'Updated Title'
    const content = 'Updated Content'

    const blog: Blog = {
      id: blogId,
      title: 'Original Title',
      content: 'Original Content',
      author: { id: userId } as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Blog

    blogRepo.findOne.mockResolvedValue(blog)
    blogRepo.save.mockResolvedValue({ ...blog, title, content })

    const updatedBlog = await blogsServices.updateBlog(
      blogId,
      userId,
      title,
      content,
    )

    expect(updatedBlog.title).toBe(title)
    expect(updatedBlog.content).toBe(content)
  })

  test('should throw error if user is not author or admin on update', async () => {
    const userId = 2
    const blogId = 1

    const blog: Blog = {
      id: blogId,
      title: 'Original Title',
      content: 'Original Content',
      author: { id: 1 } as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Blog

    blogRepo.findOne.mockResolvedValue(blog)

    await expect(
      blogsServices.updateBlog(blogId, userId, 'New Title', 'New Content'),
    ).rejects.toThrow('Unauthorized')
  })

  test('should delete blog when user is author', async () => {
    const userId = 1
    const blogId = 1

    const blog: Blog = {
      id: blogId,
      title: 'Title',
      content: 'Content',
      author: { id: userId } as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Blog

    blogRepo.findOne.mockResolvedValue(blog)

    await blogsServices.deleteBlog(blogId)

    expect(blogRepo.delete).toHaveBeenCalledWith(blogId)
  })

  test('should throw error if user is not author or admin on delete', async () => {
    const userId = 2
    const blogId = 1

    const blog: Blog = {
      id: blogId,
      title: 'Title',
      content: 'Content',
      author: { id: 1 } as User,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Blog

    blogRepo.findOne.mockResolvedValue(blog)

    await expect(blogsServices.deleteBlog(blogId)).rejects.toThrow(
      'Unauthorized',
    )
  })
})
