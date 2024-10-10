import { Request, Response, NextFunction } from 'express'
import { verifyToken, generateJwtToken, sendCookies } from '../utils/tokenUtils' // Adjust utility imports

export async function auth(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies['refreshToken']

  if (!refreshToken) {
    throw new Error('Refresh token not found')
  }

  // Attempt to verify access token; if it doesn't exist, refresh the token
  let accessTokenPayload: AuthTokenPayload | null = accessToken
    ? verifyToken(accessToken)
    : null

  if (!accessTokenPayload) {
    const refreshTokenPayload = verifyToken(refreshToken)
    if (!refreshTokenPayload) {
      throw new Error('Refresh token has expired')
    }

    const newAccessToken = generateJwtToken('15m', {
      userId: refreshTokenPayload['userId'],
    })
    sendCookies(res, 'accessToken', newAccessToken, 15 * 60 * 1000) // Set access token cookie

    accessTokenPayload = verifyToken(newAccessToken) // Verify new access token
    if (!accessTokenPayload) {
      throw new Error('Error generating new access token')
    }
  }

  // Fetch user based on userId in access token payload
  const user = await UsersRepository.getOneById({
    id: accessTokenPayload['userId'],
  })
  if (!user) {
    throw new Error('User does not exist')
  }

  // Attach user info to request object
  req.user = { id: user.id, role: user.role }
  next() // Proceed to the next middleware or route handler
}
