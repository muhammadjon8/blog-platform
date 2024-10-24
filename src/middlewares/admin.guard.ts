import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET || 'your_secret_key'

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    role: string
  }
}

export const checkAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): any => {
  const token = req.cookies?.refreshToken

  if (!token) {
    return res.status(403).json({ message: 'No token provided' })
  }

  try {
    // Decode the token and cast it to a known type
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string,
      role: string
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    }

    if (!decoded.role) {
      return res
        .status(403)
        .json({ message: 'Access denied, admin role required' })
    }

    next()
  } catch (error) {
    console.error('Token verification error:', error) // Log the error for debugging
    return res.status(401).json({ message: 'Invalid token' })
  }
}
