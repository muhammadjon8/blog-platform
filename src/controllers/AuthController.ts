import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AuthServices from '../services/AuthServices'
import { sendCookies } from '../utils/sendCookie'

const generateToken = (userId: number, isAdmin: boolean) => {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET!, { expiresIn: '1h' })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const user = await AuthServices.register(email, password, name)
    const token = generateToken(user.id, user.isAdmin)
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
    const token = generateToken(user.id, user.isAdmin)
    sendCookies(res, 'refreshToken', token, 360000)
    res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    res.status(400).json(error)
  }
}
