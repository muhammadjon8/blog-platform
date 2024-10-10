import { NextFunction, Request, Response } from 'express'

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> | void => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}
