import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  userId: string
  isAdmin: boolean
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    isAdmin: boolean
  }
}

export const auth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.refreshToken

  if (!token) {
    res.status(401).json({ message: 'Access Denied' })
    return 
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret',
    ) as UserPayload

    req.user = {
      id: decoded.userId,
      isAdmin: decoded.isAdmin,
    }

    next() 
  } catch (error) {
    res.status(403).json({ message: 'Invalid Token' })
    return 
  }
}
