import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '@/utils/jwt'
import { UserRepository } from '@/repositories/userRepository'
import { AppError } from './errorHandler'

const userRepo = new UserRepository()

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) throw new AppError('No token provided', 401)
    const token = header.slice(7)
    const payload = verifyAccessToken(token)
    const user = await userRepo.findById(payload.userId)
    if (!user) throw new AppError('User not found', 401)
    req.user = user
    next()
  } catch (err) {
    next(err instanceof AppError ? err : new AppError('Invalid token', 401))
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Forbidden: admin access required', 403))
  }
  next()
}
