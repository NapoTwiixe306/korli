import { getRedis } from "./redis"

export async function rateLimitRedis(key: string, limit: number, windowSeconds: number) {
  const redis = getRedis()
  const now = Date.now()
  const windowKey = `${key}:${Math.floor(now / (windowSeconds * 1000))}`
  const count = await redis.incr(windowKey)
  if (count === 1) {
    await redis.expire(windowKey, windowSeconds)
  }
  return count <= limit
}
