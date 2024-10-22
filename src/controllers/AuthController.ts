import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AuthServices from '../services/AuthServices'
import { sendCookies } from '../utils/sendCookie'

const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId: userId, role: role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const user = await AuthServices.register(email, password, name)
    const token = generateToken(user.id, user.role)
    sendCookies(res, 'refreshToken', token, 360000)
    res.status(201).json({ token })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await AuthServices.login(email, password)
    const token = generateToken(user.id, user.role)
    sendCookies(res, 'refreshToken', token, 360000)
    res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}
export const updateUserRole = async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.userId
  const role = req.body.role
  if (!userId ||!role) {
    return res.status(400).json({ message: 'User ID and role are required' })
  }
  if (role!== 'admin' && role!== 'user') {
    return res.status(400).json({ message: 'Invalid role' })
  }
  const result = await AuthServices.changeUserRole(+userId, role)

  return res.json({ result })
}
