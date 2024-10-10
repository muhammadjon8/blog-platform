import express from 'express'
import {
  createBlog,
  deleteBlogById,
  updateBlogById,
  getBlogs,
  getBlogById, // Add this import
} from '../controllers/blog.controller'

const router = express.Router()

router.post('/create', createBlog)
router.delete('/delete/:blogId', deleteBlogById)
router.put('/update/:blogId', updateBlogById)
router.get('/fetch', getBlogs)
router.get('/fetch/:id', getBlogById)

export default router
