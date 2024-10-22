import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { User } from '../entities/user.entity'
import { Blog } from '../entities/blog.entity'
import { Comment } from '../entities/comment.entity'
import { CreateBlogDto } from '../dtos/createBlog.dto'
import { CreateCommentDto } from '../dtos/create-comment.dto'

export class CommentService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)
  private commentRepo = AppDataSource.getRepository(Comment)

  async createComment(createCommentDto: CreateCommentDto) {}

  async getComments(blogId: number) {}

  async updateComment(commentId: number, userId: number, content: string) {}

  async deleteComment(commentId: number, userId: number, isAdmin: boolean) {}
}

export default new CommentService()
