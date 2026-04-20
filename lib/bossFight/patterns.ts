import {
  BOSS_BULLET_SPEED_SLOW,
  BOSS_BULLET_SPEED_FAST,
} from '@/components/bossFight/constants'

// Singles weighted 6×, doubles 3× — 9 patterns total matching spec
const PATTERNS: number[][] = [
  [0], [1], [2], [0], [1], [2],
  [0, 1], [1, 2], [0, 2],
]

export function pickPattern(): number[] {
  return PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
}

export interface BossShot { lane: number; speed: number }

/** Phase 1: single random lane */
export function bossPhase1Shots(): BossShot[] {
  return [{ lane: Math.floor(Math.random() * 3), speed: BOSS_BULLET_SPEED_SLOW }]
}

/** Phase 2: 2 lanes covered, 1 safe — invariant: always exactly 1 safe lane */
export function bossPhase2Shots(): BossShot[] {
  const safe = Math.floor(Math.random() * 3)
  const shots: BossShot[] = []
  for (let l = 0; l < 3; l++) {
    if (l !== safe) shots.push({ lane: l, speed: BOSS_BULLET_SPEED_SLOW })
  }
  return shots  // exactly 2 shots
}

/**
 * Phase 3: aimed at cat (fast) + random other lane (slow).
 * Invariant: exactly 1 lane is always free (the third lane).
 */
export function bossPhase3Shots(catLane: number): BossShot[] {
  const others = ([0, 1, 2] as const).filter(l => l !== catLane)
  const randomOther = others[Math.floor(Math.random() * others.length)]
  return [
    { lane: catLane,     speed: BOSS_BULLET_SPEED_FAST },
    { lane: randomOther, speed: BOSS_BULLET_SPEED_SLOW },
  ]
  // Third lane (neither catLane nor randomOther) is always free
}
