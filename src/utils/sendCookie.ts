import { Response } from 'express'

export function sendCookies(
  res: Response,
  name: string,
  data: string,
  age: number,
) {
  res.cookie(name, data, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: age,
    secure: process.env.NODE_ENV === 'production',
  })
}
