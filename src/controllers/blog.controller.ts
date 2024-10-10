import BlogService from '../services/blogs.services'
import { BlogsSearchParamsDto } from '../dtos/blog.searchparams.dto'

export const createBlog = async (req: any, res: any) => {
  console.log('Request Body:', req.body.title)
  const { title, content, author } = req.body

  console.log(content, title, author)

  try {
    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: 'Title, content, and userId are required' })
    }

    const blog = await BlogService.createBlog(req.body, author)
    return res
      .status(201)
      .json({ message: 'Blog created successfully', data: blog })
  } catch (error) {
    return res.status(400).json({ message: (error as any).message })
  }
}

export const updateBlogById = async (req: any, res: any) => {
  const { title, content, author } = req.body
  const { blogId } = req.params

  try {
    if (!blogId || !title || !content || !author) {
      return res
        .status(400)
        .json({ message: 'Blog ID, title, content, and author are required' })
    }

    const blog = await BlogService.updateBlog(
      Number(blogId),
      author,
      title,
      content,
    )
    return res
      .status(200)
      .json({ message: 'Blog updated successfully', data: blog })
  } catch (error) {
    if ((error as any).message === 'Blog not found') {
      return res.status(404).json({ message: 'Blog not found' })
    } else {
      return res.status(400).json({ message: (error as any).message })
    }
  }
}

export const deleteBlogById = async (req: any, res: any) => {
  try {
    const { blogId } = req.params

    if (!blogId) {
      return res.status(400).json({ message: 'Blog ID is required' })
    }

    await BlogService.deleteBlog(Number(blogId))
    return res.status(204).json({ message: 'Blog deleted successfully' })
  } catch (error) {
    if ((error as any).message === 'Blog not found') {
      return res.status(404).json({ message: 'Blog not found' })
    } else {
      return res.status(400).json({ message: (error as any).message })
    }
  }
}

export const getBlogs = async (req: any, res: any) => {
  try {
    const searchParams = req.query as unknown as BlogsSearchParamsDto
    const blogs = await BlogService.getBlogs(searchParams)

    return res
      .status(200)
      .json({ data: blogs, message: 'Blogs retrieved successfully' })
  } catch (error) {
    return res.status(400).json({ message: (error as any).message })
  }
}

export const getBlogById = async (req: any, res: any) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' })
    }
    const blog = await BlogService.getBlog(id)
    return res
      .status(200)
      .json({ data: blog, message: 'Blog retrieved successfully' })
  } catch (error) {
    if ((error as any).message === 'Blog not found') {
      return res.status(404).json({ message: 'Blog not found' })
    } else {
      return res.status(400).json({ message: (error as any).message })
    }
  }
}
