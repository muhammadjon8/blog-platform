import express from 'express'
import {
  createBlog,
  deleteBlogById,
  updateBlogById,
  getBlogs,
  getBlogById,
} from '../controllers/blog.controller'
import { auth } from '../middlewares/auth.middleware'
import { checkAdmin } from '../middlewares/admin.guard'

const router = express.Router()

router.post('/create', auth, createBlog)
router.delete('/delete/:blogId', auth, deleteBlogById)
router.put('/update/:blogId', auth, updateBlogById)
router.get('/fetch', checkAdmin, getBlogs)
router.get('/fetch/:id', checkAdmin, getBlogById)

export default router
