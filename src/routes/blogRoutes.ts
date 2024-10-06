import express from 'express'

import {
  createBlog,
  deleteBlogById,
  fetchBlogs,
  updateBlogById,
} from '../controllers/controller.blog'

const router = express.Router()

router.post('/create', createBlog)
router.delete('/delete/:blogId', deleteBlogById)
router.put('/update/:blogId', updateBlogById)
router.get('/fetch', fetchBlogs)

export default router
