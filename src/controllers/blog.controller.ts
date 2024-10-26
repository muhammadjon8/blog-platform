import BlogService from '../services/blogs.services'
import { BlogsSearchParamsDto } from '../dtos/blog.searchparams.dto'
import { Request, Response } from 'express'
import blogsServices from '../services/blogs.services'

export const createBlog = async (req: any, res: any) => {
  try {
    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const blog = await BlogService.createBlog(req, req.body)
    return res
      .status(201)
      .json({ message: 'Blog created successfully', data: blog })
  } catch (error) {
    return res.status(400).json({ message: (error as any).message })
  }
}

export const updateBlogById = async (req: any, res: any) => {
  try {
    const { title, content } = req.body
    const { blogId } = req.params

    if (!blogId || !title || !content) {
      return res
        .status(400)
        .json({ message: 'Blog ID, title, and content are required' })
    }

    const blog = await BlogService.updateBlog(req, +blogId, title, content)
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

    await BlogService.deleteBlog(req, +blogId)
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
    const blogs = await BlogService.getAllBlogs(res)

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
export const getBlogsBySearchParams = async (req: any, res: any) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 10
  const title = req.query.title as string
  const tags = req.query.tags as string
  const content = req.query.content as string

  const tagsArray = tags ? tags.split(',') : undefined

  const searchParams = { title, tags: tagsArray, content }

  try {
    const blogs = await blogsServices.getBlogsBySearchParams(
      +page,
      +limit,
      searchParams,
    )
    return res.status(200).json(blogs)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blogs', error })
  }
}

export const likeBlogs = async (req: any, res: any) => {
  try {
    const blogId = req.params.blogId
    if (!blogId) {
      return res.status(400).json({ message: 'Blog not found' })
    }
    const result = await blogsServices.likeBlogs(blogId, req, res)

    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Error liking/disliking blog' })
  }
}
