import Anthropic from '@anthropic-ai/sdk'
import { Redis } from '@upstash/redis'
import { NextRequest } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function isAppropriate(msg: string): Promise<boolean> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 5,
      messages: [{
        role: 'user',
        content: `A visitor wants to leave a short message in a developer's portfolio guestbook. Reply "no" only if the message contains profanity, slurs, explicit sexual content, or hate speech. Reply "yes" for anything else — greetings, compliments, random thoughts, jokes, or normal sentences are all fine. Reply only "yes" or "no".\n\nMessage to evaluate:\n---\n${msg}\n---`,
      }],
    })
    const text = (response.content[0] as { text: string }).text.toLowerCase().trim()
    return text.startsWith('yes')
  } catch {
    return true // fail open — don't block if API is down
  }
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const KEY        = 'guestbook'
const RL_PREFIX  = 'gb:rl:'
const MAX_ENTRIES = 100
const MAX_MSG_LEN = 100
const RL_MAX     = 3
const RL_WINDOW  = 60 * 60   // 1 hour in seconds

export interface GuestbookEntry {
  msg: string
  ts:  number
}

export async function GET() {
  const raw = await redis.lrange<string>(KEY, 0, MAX_ENTRIES - 1)
  const entries: GuestbookEntry[] = raw.map(r => {
    try { return typeof r === 'string' ? JSON.parse(r) : r }
    catch { return null }
  }).filter(Boolean)
  return Response.json({ entries })
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  // Rate limit: 3 posts per hour per IP
  const rlKey = `${RL_PREFIX}${ip}`
  const count = await redis.incr(rlKey)
  if (count === 1) await redis.expire(rlKey, RL_WINDOW)
  if (count > RL_MAX) {
    return Response.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: { msg?: unknown }
  try { body = await request.json() }
  catch { return Response.json({ error: 'invalid_body' }, { status: 400 }) }

  if (typeof body.msg !== 'string') {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }

  const clean = body.msg
    .replace(/<[^>]*>/g, '')          // strip HTML tags
    .replace(/[\x00-\x1f\x7f]/g, '') // strip control chars
    .trim()
    .slice(0, MAX_MSG_LEN)

  if (!clean) {
    return Response.json({ error: 'empty_message' }, { status: 400 })
  }

  if (!await isAppropriate(clean)) {
    return Response.json({ error: 'inappropriate' }, { status: 422 })
  }

  const entry: GuestbookEntry = { msg: clean, ts: Date.now() }
  await redis.lpush(KEY, JSON.stringify(entry))
  await redis.ltrim(KEY, 0, MAX_ENTRIES - 1)

  return Response.json({ ok: true })
}
