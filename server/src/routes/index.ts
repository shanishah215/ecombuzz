import { Router } from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import categoryRoutes from './categories'
import cartRoutes from './cart'
import wishlistRoutes from './wishlist'
import orderRoutes from './orders'
import addressRoutes from './addresses'
import userRoutes from './users'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/orders', orderRoutes)
router.use('/addresses', addressRoutes)
router.use('/users', userRoutes)

export default router
