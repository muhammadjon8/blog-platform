import { Blog } from '../entities/blog.entity'
import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'
import { BlogsSearchParamsDto } from '../dtos/blog.searchparams.dto'
import { FindManyOptions } from 'typeorm'
import { CreateBlogDto } from '../dtos/createBlog.dto'
import * as jwt from 'jsonwebtoken'
import { Request } from 'express' 
import CustomJwtPayload from '../utils/customJwtPayload'

class BlogService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)

  private async extractUserIdFromToken(req: Request): Promise<number> {
    const jwtSecret = process.env.JWT_SECRET || "secret"

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

  async createBlog(req: Request, blogDto: CreateBlogDto): Promise<Blog> {
    const authorId = await this.extractUserIdFromToken(req) 

    const author = await this.userRepo.findOne({ where: { id: authorId } })
    if (!author) {
      throw new Error('User not found')
    }

    const newBlog = this.blogRepo.create({
      author,
      content: blogDto.content,
      title: blogDto.title,
    })

    return await this.blogRepo.save(newBlog)
  }

  async updateBlog(
    req: Request,
    blogId: number,
    title: string,
    content: string,
  ): Promise<Blog> {
    const authorId = await this.extractUserIdFromToken(req) 

    const blog = await this.blogRepo.findOne({
      where: { id: blogId },
      relations: ['author'],
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    if (blog.author.id !== authorId) {
      throw new Error('You are not the author of this blog')
    }

    blog.title = title
    blog.content = content

    return this.blogRepo.save(blog)
  }

  async deleteBlog(req: Request, blogId: number): Promise<void> {
    const authorId = await this.extractUserIdFromToken(req) 

    const blog = await this.blogRepo.findOne({
      where: { id: blogId },
      relations: ['author'],
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    if (blog.author.id !== authorId) {
      throw new Error('You are not authorized to delete this blog')
    }

    await this.blogRepo.delete(blogId)
  }

  
  async getBlogs(searchParams: BlogsSearchParamsDto): Promise<Blog[]> {
    const page = searchParams.page || 1
    const limit = searchParams.limit || 10

    const options: FindManyOptions<Blog> = {
      skip: (page - 1) * limit,
      take: limit,
    }

    return await this.blogRepo.find(options)
  }


  async getBlog(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOne({ where: { id: +id } })

    if (!blog) {
      throw new Error('Blog not found')
    }

    return blog
  }
}

export default new BlogService()
