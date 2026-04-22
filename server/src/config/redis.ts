import { createClient } from 'redis'
import { env } from './env'

export const redisClient = createClient({ url: env.REDIS_URL })

redisClient.on('error', (err) => console.error('Redis error:', err))
redisClient.on('connect', () => console.log('Redis connected'))

export async function connectRedis() {
  try {
    await redisClient.connect()
  } catch (err) {
    console.warn('Redis connection failed — running without Redis (token revocation disabled):', err)
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const val = await redisClient.get(key)
  return val ? (JSON.parse(val) as T) : null
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300) {
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(value))
}

export async function cacheDel(key: string) {
  await redisClient.del(key)
}
