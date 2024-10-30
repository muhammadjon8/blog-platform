import { Repository } from 'typeorm'
import { CommentService } from '../../services/comment.service'
import { Blog } from '../../entities/blog.entity'
import { User } from '../../entities/user.entity'
import { Comment } from '../../entities/comment.entity'
import { AppDataSource } from '../../data-source'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ userId: 1 }),
}))

describe('CommentService', () => {
  let commentService: CommentService
  let userRepo: Repository<User>
  let blogRepo: Repository<Blog>
  let commentRepo: Repository<Comment>

  beforeEach(() => {
    userRepo = AppDataSource.getRepository(User)
    blogRepo = AppDataSource.getRepository(Blog)
    commentRepo = AppDataSource.getRepository(Comment)
    commentService = new CommentService()
  })

  it('should create a new comment', async () => {
    const mockUser = { id: 1, username: 'testuser' }
    const mockBlog = { id: 1, title: 'Test Blog' }
    const mockComment = { content: 'Test Comment' }

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser)
    jest.spyOn(blogRepo, 'findOne').mockResolvedValue(mockBlog as Blog)
    jest.spyOn(commentRepo, 'create').mockReturnValue(mockComment as Comment)
    jest.spyOn(commentRepo, 'save').mockResolvedValue({
      ...mockComment,
      id: 1,
      author: mockUser,
      blog: mockBlog,
    })

    const result = await commentService.createComment(
      { cookies: { refreshToken: 'mockToken' } } as any,
      { content: 'Test Comment' },
      1,
    )

    expect(result.content).toBe('Test Comment')
    expect(result).toHaveProperty('id')
    expect(result.author).toBe(mockUser)
  })

  it('should fetch comments for a blog', async () => {
    const mockComments = [{ id: 1, content: 'Test Comment' }]
    jest.spyOn(commentRepo, 'find').mockResolvedValue(mockComments as Comment[])

    const result = await commentService.getComments(1)
    expect(result).toHaveLength(1)
    expect(result[0].content).toBe('Test Comment')
  })

  it('should update a comment', async () => {
    const mockComment = { id: 1, content: 'Old Content' }

    jest.spyOn(commentRepo, 'findOne').mockResolvedValue(mockComment as Comment)
    jest.spyOn(commentRepo, 'save').mockResolvedValue({
      ...mockComment,
      content: 'Updated Content',
    } as Comment)

    const result = await commentService.updateComment(1, 1, 'Updated Content')
    expect(result.content).toBe('Updated Content')
  })

  it('should delete a comment', async () => {
    const mockComment = { id: 1, content: 'Comment to delete' }

    jest.spyOn(commentRepo, 'findOne').mockResolvedValue(mockComment as Comment)
    jest.spyOn(commentRepo, 'delete').mockResolvedValue({} as any)

    await expect(commentService.deleteComment(1, 1)).resolves.not.toThrow()
  })
})
