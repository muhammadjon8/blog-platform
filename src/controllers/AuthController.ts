import jwt from 'jsonwebtoken'
import AuthServices from '../services/AuthServices'
import { sendCookies } from '../utils/sendCookie'
import { Request, Response } from 'express'

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
export const updateUserRole = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userId = req.params.userId
  const role = req.body.role
  if (!userId || !role) {
    return res.status(400).json({ message: 'User ID and role are required' })
  }
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ message: 'Invalid role' })
  }
  const result = await AuthServices.changeUserRole(+userId, role)

  return res.json({ result })
}

export const getUserProfile = async (req: any, res: any): Promise<void> => {
  const user = await AuthServices.getUserProfile(req)

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  return res.status(200).json({ user })
}

export const updateProfile = async (
  req: any,
  res: any,
): Promise<void> => {
  try {
    const updatedUser = await AuthServices.updateProfile(req)
    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    if (error === 'User not found') {
      return res.status(404).json({ message: 'User not found' })
    }
    return res
      .status(500)
      .json({ message: 'Failed to update user profile', error: error })
  }
}
