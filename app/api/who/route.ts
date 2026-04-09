import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const KEY    = 'who:visitors'
const WINDOW = 2 * 60 * 1000  // 2 minutes in ms

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const now    = Date.now()
  const cutoff = now - WINDOW

  await redis.zadd(KEY, { score: now, member: ip })
  await redis.zremrangebyscore(KEY, 0, cutoff)
  const count = await redis.zcard(KEY)

  return Response.json({ count })
}
