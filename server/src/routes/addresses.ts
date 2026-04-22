import { Router } from 'express'
import { z } from 'zod'
import { addressController } from '@/controllers/addressController'
import { authenticate } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()
router.use(authenticate)

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  isDefault: z.boolean().optional(),
})

router.get('/', addressController.getAll)
router.post('/', validate(addressSchema), addressController.create)
router.put('/:id', validate(addressSchema.partial()), addressController.update)
router.delete('/:id', addressController.delete)

export default router
