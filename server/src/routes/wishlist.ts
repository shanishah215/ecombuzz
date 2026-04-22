import { Router } from 'express'
import { z } from 'zod'
import { wishlistController } from '@/controllers/wishlistController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

router.use(authenticate)

const addSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
})

// GET    /api/wishlist
router.get('/', wishlistController.getWishlist)

// POST   /api/wishlist
router.post('/', validate(addSchema), wishlistController.addProduct)

// DELETE /api/wishlist/:productId
router.delete('/:productId', wishlistController.removeProduct)

export default router
