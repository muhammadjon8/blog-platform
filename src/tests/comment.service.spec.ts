import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dtos/create-comment.dto'
import { User } from '../entities/user.entity'
import { Blog } from '../entities/blog.entity'
import { Comment } from '../entities/comment.entity'

describe('CommentService', () => {
  let commentService: CommentService

  const mockUserRepo = {
    findOne: jest.fn(),
  }

  const mockBlogRepo = {
    findOne: jest.fn(),
  }

  const mockCommentRepo = {
    create: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(() => {
    commentService = new CommentService()
    ;(commentService as any).userRepo = mockUserRepo
    ;(commentService as any).blogRepo = mockBlogRepo
    ;(commentService as any).commentRepo = mockCommentRepo
  })

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
      }
      const req: any = { cookies: { refreshToken: 'valid_token' } }

      const mockUser = { id: 1, name: 'User1' } as User
      const mockBlog = { id: 1, title: 'Test Blog' } as Blog
      const mockComment = {
        id: 1,
        content: 'Test comment',
        blog: mockBlog,
        author: mockUser,
      } as Comment

      jest.spyOn(commentService, 'extractUserIdFromToken').mockResolvedValue(1)
      mockUserRepo.findOne.mockResolvedValue(mockUser)
      mockBlogRepo.findOne.mockResolvedValue(mockBlog)
      mockCommentRepo.create.mockReturnValue(mockComment)
      mockCommentRepo.save.mockResolvedValue(mockComment)

      const result = await commentService.createComment(
        req,
        createCommentDto,
        1,
      )

      expect(result).toEqual(mockComment)
      expect(mockCommentRepo.save).toHaveBeenCalledWith(mockComment)
    })

    it('should throw an error if the blog is not found', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
      }
      const req: any = { cookies: { refreshToken: 'valid_token' } }

      jest.spyOn(commentService, 'extractUserIdFromToken').mockResolvedValue(1)
      mockBlogRepo.findOne.mockResolvedValue(null)

      await expect(
        commentService.createComment(req, createCommentDto, 1),
      ).rejects.toThrow('Blog not found')
    })
  })

  describe('getComments', () => {
    it('should return comments for a blog', async () => {
      const mockBlog = { id: 1 } as Blog
      const mockComments = [{ id: 1, content: 'Test comment' }] as Comment[]

      mockBlogRepo.findOne.mockResolvedValue(mockBlog)
      mockCommentRepo.find.mockResolvedValue(mockComments)

      const result = await commentService.getComments(1)

      expect(result).toEqual(mockComments)
      expect(mockCommentRepo.find).toHaveBeenCalledWith({
        where: { blog: { id: 1 } },
      })
    })

    it('should throw an error if the blog is not found', async () => {
      mockBlogRepo.findOne.mockResolvedValue(null)

      await expect(commentService.getComments(1)).rejects.toThrow(
        'Blog not found',
      )
    })
  })
  describe('updateComment', () => {
    it('should update the comment content', async () => {
      const mockComment = { id: 1, content: 'Old content' } as Comment

      mockCommentRepo.findOne.mockResolvedValue(mockComment)

      const updatedComment = await commentService.updateComment(
        1,
        1,
        'New content',
      )

      expect(mockCommentRepo.save).toHaveBeenCalledWith({
        ...mockComment,
        content: 'New content',
      })
      expect(updatedComment.content).toBe('New content')
    })

    it('should throw an error if the comment is not found', async () => {
      mockCommentRepo.findOne.mockResolvedValue(null)

      await expect(
        commentService.updateComment(1, 1, 'New content'),
      ).rejects.toThrow('Comment not found')
    })
  })

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const mockComment = { id: 1, blog: { id: 1 } } as Comment

      mockCommentRepo.findOne.mockResolvedValue(mockComment)

      await commentService.deleteComment(1, 1)

      expect(mockCommentRepo.delete).toHaveBeenCalledWith({
        id: 1,
        blog: { id: 1 },
      })
    })

    it('should throw an error if the comment is not found', async () => {
      mockCommentRepo.findOne.mockResolvedValue(null)

      await expect(commentService.deleteComment(1, 1)).rejects.toThrow(
        'Comment not found',
      )
    })
  })
})
