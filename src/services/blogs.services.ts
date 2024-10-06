import { Blog } from '../entities/entity.blog'
import { User } from '../entities/entity.user'
import { AppDataSource } from '../data-source'

class BlogService {
  private userRepo = AppDataSource.getRepository(User)
  private blogRepo = AppDataSource.getRepository(Blog)

  async createBlog(userId: number, title: string, content: string) {
    const author = await this.userRepo.findOne({ where: { id: userId } })

    if (!author) {
      throw new Error('User not found')
    }

    const blog = this.blogRepo.create({ title, content, author })
    return this.blogRepo.save(blog)
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
    const user = await this.userRepo.findOne({where: { id: author }})

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

  async fetchBlogs(page: number, limit: number): Promise<Blog[]> {
    const blogRepo = AppDataSource.getRepository(Blog)

    console.log(`Fetching blogs: page=${page}, limit=${limit}`) // Log pagination parameters

    const blogs = await blogRepo.find({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['author'], // Load related author data
    })

    console.log(`Fetched blogs: ${JSON.stringify(blogs)}`) // Log fetched blogs

    return blogs
  }
}

export default new BlogService()
