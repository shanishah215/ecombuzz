import { Router } from 'express'
import { z } from 'zod'
import { orderController } from '@/controllers/orderController'
import { authenticate, requireAdmin } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

const createOrderSchema = z.object({
  addressId: z.string().min(1, 'addressId is required'),
  paymentMethod: z.enum(['cod', 'online'], 'paymentMethod must be cod or online'),
})

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
})

// User routes
router.post('/', authenticate, validate(createOrderSchema), orderController.create)
router.get('/', authenticate, orderController.getUserOrders)
router.get('/:id', authenticate, orderController.getById)

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, orderController.getAllAdmin)
router.patch('/:id/status', authenticate, requireAdmin, validate(updateStatusSchema), orderController.updateStatus)

export default router
