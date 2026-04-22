import { Router } from 'express'
import { z } from 'zod'
import { authController } from '@/controllers/authController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register)

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login)

// POST /api/auth/refresh  (reads refreshToken from httpOnly cookie)
router.post('/refresh', authController.refresh)

// POST /api/auth/logout  (protected — clears stored token for this user)
router.post('/logout', authenticate, authController.logout)

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe)

export default router
