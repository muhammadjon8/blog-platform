import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['refreshToken']

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string
      role: string
    }

    
    ;(req as any).user = {
      id: decoded.userId,
      role: decoded.role,
    }

    next() 
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token' })
  }
}
