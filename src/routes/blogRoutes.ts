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
import { createComment, deleteComment, getComments, updateComment } from '../controllers/comment.controller'

const router = express.Router()

router.post('/create', auth, createBlog)
router.delete('/delete/:blogId', auth, deleteBlogById)
router.put('/update/:blogId', auth, updateBlogById)
router.get('/fetch', checkAdmin, getBlogs)
router.get('/fetch/:id', checkAdmin, getBlogById)

//comment route
router.post('/:blogId/comments', auth, createComment)
router.get('/:blogId/comments',checkAdmin, getComments)
router.put('/:blogId/comments/:commentId', auth, updateComment)
router.delete('/:blogId/comments/:commentId', auth, deleteComment) 

export default router
