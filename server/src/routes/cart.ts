import { Router } from 'express'
import { z } from 'zod'
import { cartController } from '@/controllers/cartController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

// All cart routes require authentication
router.use(authenticate)

const addItemSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().int().positive().default(1),
})

const updateItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
})

// GET  /api/cart
router.get('/', cartController.getCart)

// POST /api/cart
router.post('/', validate(addItemSchema), cartController.addItem)

// PUT  /api/cart/:productId
router.put('/:productId', validate(updateItemSchema), cartController.updateItem)

// DELETE /api/cart/:productId
router.delete('/:productId', cartController.removeItem)

// DELETE /api/cart
router.delete('/', cartController.clearCart)

export default router
