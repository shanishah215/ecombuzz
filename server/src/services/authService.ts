import { UserRepository } from '@/repositories/userRepository'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt'
import { AppError } from '@/middleware/errorHandler'
import { redisClient } from '@/config/redis'

const userRepo = new UserRepository()

// Refresh token TTL matches JWT_REFRESH_EXPIRES (7 days in seconds)
const REFRESH_TTL = 7 * 24 * 60 * 60

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepo.findByEmail(email)
    if (existing) throw new AppError('Email already in use', 409)

    const user = await userRepo.create({ name, email, password })
    const accessToken = signAccessToken(String(user._id), user.role)
    const refreshToken = signRefreshToken(String(user._id))

    try {
      await redisClient.setEx(`refresh:${user._id}`, REFRESH_TTL, refreshToken)
    } catch (redisErr) {
      console.warn('Redis unavailable – refresh token not stored:', redisErr)
    }

    return { user, accessToken, refreshToken }
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email)
    if (!user) throw new AppError('Invalid email or password', 401)

    const valid = await user.comparePassword(password)
    if (!valid) throw new AppError('Invalid email or password', 401)

    const accessToken = signAccessToken(String(user._id), user.role)
    const refreshToken = signRefreshToken(String(user._id))

    try {
      await redisClient.setEx(`refresh:${user._id}`, REFRESH_TTL, refreshToken)
    } catch (redisErr) {
      console.warn('Redis unavailable – refresh token not stored:', redisErr)
    }

    return { user, accessToken, refreshToken }
  },

  async refresh(token: string) {
    let payload: { userId: string }
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new AppError('Invalid refresh token', 401)
    }

    const stored = await redisClient.get(`refresh:${payload.userId}`)
    if (!stored || stored !== token) throw new AppError('Refresh token expired or revoked', 401)

    const user = await userRepo.findById(payload.userId)
    if (!user) throw new AppError('User not found', 401)

    const accessToken = signAccessToken(String(user._id), user.role)
    // Rotate refresh token
    const newRefreshToken = signRefreshToken(String(user._id))
    try {
      await redisClient.setEx(`refresh:${user._id}`, REFRESH_TTL, newRefreshToken)
    } catch (redisErr) {
      console.warn('Redis unavailable – refresh token rotation skipped:', redisErr)
    }

    return { accessToken, refreshToken: newRefreshToken, user }
  },

  async logout(userId: string) {
    await redisClient.del(`refresh:${userId}`)
  },

  async getMe(userId: string) {
    const user = await userRepo.findById(userId)
    if (!user) throw new AppError('User not found', 404)
    return user
  },
}
