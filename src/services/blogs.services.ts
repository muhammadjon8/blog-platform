import { Blog } from '../entities/blog.entity'
import { User } from '../entities/user.entity'
import { AppDataSource } from '../data-source'
import { BlogsSearchParamsDto } from '../dtos/blog.searchparams.dto'
import { FindManyOptions } from 'typeorm'
import { CreateBlogDto } from '../dtos/createBlog.dto'

class BlogService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)

  async createBlog(blogDto: CreateBlogDto, authorId: User): Promise<Blog> {
    return await this.blogRepo.save({
      author: authorId,
      content: blogDto.content,
      title: blogDto.title,
    })
  }

  async updateBlog(
    blogId: number,
    author: number,
    title: string,
    content: string,
  ): Promise<Blog> {
    const blog = await this.blogRepo.findOne({
      where: { id: blogId },
      relations: ['author'],
    })

    if (!blog) {
      throw new Error('Blog not found')
    }
    const user = await this.userRepo.findOne({ where: { id: author } })

    if (blog.author.id !== author && user?.isAdmin == false) {
      throw new Error('Unauthorized')
    }

    blog.title = title
    blog.content = content
    const isAuthor = await this.userRepo.findOne({ where: { id: author } })
    if (isAuthor) {
      blog.author = isAuthor
    }

    return this.blogRepo.save(blog)
  }

  async deleteBlog(blogId: number): Promise<void> {
    const blog = await this.blogRepo.findOne({
      where: {
        id: blogId,
      },
    })
    if (!blog) {
      throw new Error('Blog not found')
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
