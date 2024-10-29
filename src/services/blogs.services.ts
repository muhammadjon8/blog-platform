import { Blog } from '../entities/blog.entity'
import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'
import { CreateBlogDto } from '../dtos/createBlog.dto'
import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import CustomJwtPayload from '../utils/customJwtPayload'
import { plainToInstance } from 'class-transformer'

class BlogService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)

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
      tags: blogDto.tags,
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

  async getAllBlogs(res: Response) {
    try {
      const blogs = await this.blogRepo.find({
        relations: ['likes'],
      })

      return res.status(200).json(blogs)
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Failed to retrieve blogs', error })
    }
  }

  async getBlog(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOne({
      where: { id: +id },
      select: ['likes'],
    })

    if (!blog) {
      throw new Error('Blog not found')
    }

    return blog
  }

  async getBlogsBySearchParams(
    page: number = 1,
    limit: number = 10,
    searchParams?: { title?: string; tags?: string[]; content?: string },
  ) {
    const query = this.blogRepo.createQueryBuilder('blog')

    if (searchParams?.title) {
      query.andWhere('blog.title ILIKE :title', {
        title: `%${searchParams.title}%`,
      })
    }

    if (searchParams?.tags && searchParams?.tags.length > 0) {
      query.andWhere('blog.tags @> :tags', {
        tags: JSON.stringify(searchParams?.tags),
      })
    }

    if (searchParams?.content) {
      query.andWhere('blog.content ILIKE :content', {
        content: `%${searchParams.content}%`,
      })
    }

    const [blogs, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      data: blogs,
      total,
      page,
      limit,
    }
  }
  async likeBlogs(blogId: string, req: Request, res: Response) {
    const authorId = await this.extractUserIdFromToken(req)
    const author = await this.userRepo.findOne({ where: { id: authorId } })
    const blog = await this.blogRepo.findOne({
      where: { id: +blogId },
      relations: ['likes'],
    })

    if (!author) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }

    const likedBy = blog.likes.some((user) => user.id === authorId)

    if (likedBy) {
      blog.likes = blog.likes.filter((user) => user.id !== authorId)
    } else {
      blog.likes.push(author)
    }

    try {
      await this.blogRepo.save(blog)
      const transformedBlog = plainToInstance(Blog, blog)

      return res.status(200).json({
        message: likedBy ? 'Blog unliked' : 'Blog liked',
        blog: transformedBlog,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update likes', error })
    }
  }
}

export default new BlogService()
