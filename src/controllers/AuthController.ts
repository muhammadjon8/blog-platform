import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import AuthServices from '../services/AuthServices'

const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' })
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const user = await AuthServices.register(email, password, name)
    const token = generateToken(user.id)
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
    const token = generateToken(user.id)
    res.status(200).json({ token })
  } catch (error) {
    console.log(error)
    res.status(400).json( error )
  }
}
