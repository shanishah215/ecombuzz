import type { Request, Response, NextFunction } from 'express'
import { authService } from '@/services/authService'
import { successResponse } from '@/utils/apiResponse'
import { AppError } from '@/middleware/errorHandler'
import type { IUser } from '@/models/User'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, COOKIE_OPTS)
}

function sanitizeUser(user: IUser) {
  const obj = user.toObject() as Record<string, unknown>
  delete obj.password
  delete obj.__v
  return obj
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as {
        name: string; email: string; password: string
      }
      const { user, accessToken, refreshToken } = await authService.register(name, email, password)
      setRefreshCookie(res, refreshToken)
      successResponse(res, { user: sanitizeUser(user), accessToken }, 'Registration successful', 201)
    } catch (err) { next(err) }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as { email: string; password: string }
      const { user, accessToken, refreshToken } = await authService.login(email, password)
      setRefreshCookie(res, refreshToken)
      successResponse(res, { user: sanitizeUser(user), accessToken }, 'Login successful')
    } catch (err) { next(err) }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string | undefined = req.cookies?.refreshToken
      if (!token) throw new AppError('No refresh token', 401)
      const { accessToken, refreshToken, user } = await authService.refresh(token)
      setRefreshCookie(res, refreshToken)
      successResponse(res, { accessToken, user: sanitizeUser(user) }, 'Token refreshed')
    } catch (err) { next(err) }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) await authService.logout(String(req.user._id))
      res.clearCookie('refreshToken', COOKIE_OPTS)
      successResponse(res, null, 'Logged out')
    } catch (err) { next(err) }
  },

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(String(req.user!._id))
      successResponse(res, sanitizeUser(user), 'User fetched')
    } catch (err) { next(err) }
  },
}
