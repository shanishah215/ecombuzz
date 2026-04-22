import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env var: ${key}`)
  return val
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '5000', 10),
  MONGO_URI: required('MONGO_URI'),
  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://localhost:6379',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
}
