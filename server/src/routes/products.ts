import { Router } from 'express'
import { z } from 'zod'
import { productController } from '@/controllers/productController'
import { authenticate, requireAdmin } from '@/middleware/auth'
import { validate } from '@/middleware/validate'

const router = Router()

const productSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  originalPrice: z.number().positive(),
  discount: z.number().min(0).max(100).optional(),
  images: z.array(z.string().url()).min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  stock: z.number().int().min(0),
  tags: z.array(z.string()).optional(),
  slug: z.string().optional(),
})

const updateSchema = productSchema.partial()

// ─── Public routes ────────────────────────────────────────────────────────────
// GET /api/products?category=&brand=&minPrice=&maxPrice=&rating=&search=&sort=&page=&limit=
router.get('/', productController.getAll)

// GET /api/products/id/:id  (used internally / admin)
router.get('/id/:id', productController.getById)

// GET /api/products/:slug
router.get('/:slug', productController.getBySlug)

// ─── Admin routes ─────────────────────────────────────────────────────────────
// POST /api/products
router.post('/', authenticate, requireAdmin, validate(productSchema), productController.create)

// PUT /api/products/:id
router.put('/:id', authenticate, requireAdmin, validate(updateSchema), productController.update)

// DELETE /api/products/:id
router.delete('/:id', authenticate, requireAdmin, productController.delete)

export default router
