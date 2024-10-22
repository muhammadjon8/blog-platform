import { Request, Response } from 'express'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dtos/create-comment.dto'

const commentService = new CommentService()

export const createComment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const createCommentDto: CreateCommentDto = req.body
    const newComment = await commentService.createComment(req, createCommentDto, +req.params.blogId)
    return res.status(201).json(newComment)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const getComments = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const blogId = parseInt(req.params.blogId, 10)
    const comments = await commentService.getComments(blogId)
    return res.status(200).json(comments)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const updateComment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const blogId = parseInt(req.params.blogId, 10)
    const commentId = parseInt(req.params.commentId, 10)
    const { content } = req.body

    const updatedComment = await commentService.updateComment(
      blogId,
      commentId,
      content,
    )
    return res.status(200).json(updatedComment)
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}

export const deleteComment = async (
  req: Request,
    res: Response,
): Promise<any> => {
  try {
    const blogId = req.params.blogId
    const commentId = req.params.commentId

    await commentService.deleteComment(+blogId, +commentId)
    return res.status(204).send()
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message })
  }
}
