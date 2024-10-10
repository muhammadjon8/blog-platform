import { Request, Response } from 'express'
import { CommentService } from '../services/commentService'
import { sanitize } from 'dompurify' // for XSS prevention

const commentService = new CommentService()

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const sanitizedContent = sanitize(content)
    const { blogId } = req.params
    const userId = (req.user as any).id

    const comment = await commentService.createComment(
      sanitizedContent,
      parseInt(blogId),
      userId,
    )
    res.status(201).json(comment)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

export const editComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const sanitizedContent = sanitize(content)
    const { id } = req.params
    const userId = (req.user as any).id

    const comment = await commentService.editComment(
      parseInt(id),
      userId,
      sanitizedContent,
    )
    res.status(200).json(comment)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req.user as any).id
    const isAdmin = (req.user as any).role === 'admin' // Assuming user role from auth middleware

    await commentService.deleteComment(parseInt(id), userId, isAdmin)
    res.status(204).send()
  } catch (err) {
    res.status(400).json({ error: err })
  }
}

export const fetchComments = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params
    const comments = await commentService.fetchComments(parseInt(blogId))
    res.status(200).json(comments)
  } catch (err) {
    res.status(400).json({ error: err })
  }
}
