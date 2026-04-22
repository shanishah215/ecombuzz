import { Router } from 'express'
import { UserRepository } from '@/repositories/userRepository'
import { authenticate, requireAdmin } from '@/middleware/auth'
import { successResponse } from '@/utils/apiResponse'

const router = Router()
const userRepo = new UserRepository()

// GET /api/users — admin: paginated user list
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1
    const [users, total] = await Promise.all([userRepo.findAll(page), userRepo.countAll()])
    successResponse(res, { users, total, page, totalPages: Math.ceil(total / 20) }, 'Users fetched')
  } catch (err) { next(err) }
})

export default router
