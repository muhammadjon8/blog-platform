// comment.service.ts

import { Request } from 'express'
import { AppDataSource } from '../data-source'
import { Blog } from '../entities/blog.entity'
import { Comment } from '../entities/comment.entity'
import { User } from '../entities/user.entity'
import CustomJwtPayload from '../utils/customJwtPayload'
import * as jwt from 'jsonwebtoken'
import { CreateCommentDto } from '../dtos/create-comment.dto'

export class CommentService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)
  private commentRepo = AppDataSource.getRepository(Comment)

  private async extractUserIdFromToken(req: Request): Promise<number> {
    const jwtSecret = process.env.JWT_SECRET || 'secret'

    const token = req.cookies?.refreshToken
    if (!token) {
      throw new Error('No refresh token found')
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as CustomJwtPayload
      return decoded.userId
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async createComment(
    req: Request,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const authorId = await this.extractUserIdFromToken(req)

    const author = await this.userRepo.findOne({ where: { id: authorId } })
    if (!author) {
      throw new Error('User not found')
    }

    const blog = await this.blogRepo.findOne({
      where: { id: createCommentDto.blogId },
    })
    if (!blog) {
      throw new Error('Blog not found')
    }

    const newComment = this.commentRepo.create({
      author,
      content: createCommentDto.content,
      blog,
    })
    return await this.commentRepo.save(newComment)
  }

  async getComments(blogId: number): Promise<Comment[]> {
    const comments = await this.commentRepo.find({
      where: { blog: { id: blogId } },
    })
    return comments
  }

  async updateComment(blogId: number, commentId: number, content: string) {
    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        blog: {
          id: blogId,
        },
      },
    })

    if (!comment) {
      throw new Error('Comment not found')
    }

    comment.content = content
    await this.commentRepo.save(comment)

    return comment
  }

  async deleteComment(
    req: Request,
    blogId: number,
    commentId: number 
  ) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId, blog: { id: blogId } },
    })
    if (!comment) {
      throw new Error('Comment not found')
    }
    return await this.commentRepo.delete(comment)
  }
}
