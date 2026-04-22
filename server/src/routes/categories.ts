import { Router } from 'express'
import { z } from 'zod'
import { categoryController } from '@/controllers/categoryController'
import { authenticate, requireAdmin } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
})

router.get('/', categoryController.getAll)
router.get('/:slug', categoryController.getBySlug)

router.post('/', authenticate, requireAdmin, validate(categorySchema), categoryController.create)
router.put('/:id', authenticate, requireAdmin, validate(categorySchema.partial()), categoryController.update)
router.delete('/:id', authenticate, requireAdmin, categoryController.delete)

export default router
