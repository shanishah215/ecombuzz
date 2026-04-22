import { env } from '@/config/env'
import { connectDB } from '@/config/db'
import { connectRedis } from '@/config/redis'
import app from './app'

async function bootstrap() {
  await connectDB()
  await connectRedis()
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
