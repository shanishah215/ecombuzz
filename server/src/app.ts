import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from '@/config/env'
import router from '@/routes'
import { errorHandler } from '@/middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', router)

app.use(errorHandler)

export default app
