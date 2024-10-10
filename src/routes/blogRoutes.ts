import express from 'express'
import {
  createBlog,
  deleteBlogById,
  updateBlogById,
  getBlogs,
  getBlogById, // Add this import
} from '../controllers/blog.controller'
import { auth } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/create', auth, createBlog)
router.delete('/delete/:blogId', auth, deleteBlogById)
router.put('/update/:blogId', auth, updateBlogById)
router.get('/fetch', getBlogs)
router.get('/fetch/:id', getBlogById)

export default router
