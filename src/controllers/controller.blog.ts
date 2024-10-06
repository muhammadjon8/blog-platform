import { Request, Response } from 'express'
import BlogService from '../services/blogs.services'

export const createBlog = async (req: Request, res: Response) => {
  const { title, content, userId } = req.body

  try {
    const blog = BlogService.createBlog(userId, title, content)
    res.status(201).json({ message: 'Blog created successfully', data: blog })
  } catch (error) {
    res.status(400).json({ message: error })
  }
}

export const updateBlogById = (req: Request, res: Response) => {
  const { title, content, author } = req.body
  const { blogId } = req.params

  try {
    const blog = BlogService.updateBlog(Number(blogId), author, title, content)
    res.status(200).json({ message: 'Blog updated successfully', data: blog })
  } catch (error) {
    if ((error as any).message === 'Blog not found') {
      // Return 404 Not Found if the blog does not exist
      res.status(404).json({ message: 'Blog not found' })
    } else {
      // For other errors, return 400 Bad Request
      res
        .status(400)
        .json({ message: 'Error deleting blog', error: (error as any).message })
    }
  }
}

export const deleteBlogById = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params

    // Await for the deletion process and check if the blog exists
    await BlogService.deleteBlog(Number(blogId))

    // Send 204 No Content response after successful deletion
    res.status(204).json({ message: 'Blog deleted successfully' })
  } catch (error) {
    if ((error as any).message === 'Blog not found') {
      // Return 404 Not Found if the blog does not exist
      res.status(404).json({ message: 'Blog not found' })
    } else {
      // For other errors, return 400 Bad Request
      res
        .status(400)
        .json({ message: 'Error deleting blog', error: (error as any).message })
    }
  }
}


export const fetchBlogs = async (req: Request, res: Response) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Fetch blogs using the service method
    const blogs = await BlogService.fetchBlogs(page, limit);

    // Format the blogs to include only necessary fields
    const formattedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author ? { id: blog.author.id, name: blog.author.name } : null,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    // Send the response with formatted blogs
    return res.status(200).json({ blogs: formattedBlogs });
  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while fetching blogs.' });
  }
}
