import { Cat, Bug, Token, Particle } from '@/components/bossFight/types'
import { CAT_X, CAT_HP, LANES } from '@/components/bossFight/constants'

export function makeCat(): Cat {
  return {
    x:            CAT_X,
    y:            LANES[1],
    lane:         1,
    hp:           CAT_HP,
    iframes:      0,
    animFrame:    0,
    animTick:     0,
    armed:        false,
    shootCooldown: 0,
  }
}

export function makeBug(id: number, lane: number, type: 'normal' | 'fast', label: string): Bug {
  return {
    id,
    x:           660,
    y:           LANES[lane],
    lane,
    wobblePhase: Math.random() * Math.PI * 2,
    type,
    label,
    hp:          1,
  }
}

export function makeToken(id: number, lane: number): Token {
  return {
    id,
    x:    660,
    lane,
    y:    LANES[lane],
  }
}

export function makeParticle(
  x: number, y: number,
  vx: number, vy: number,
  color: string,
  size = 3,
): Particle {
  const life = 20 + Math.floor(Math.random() * 11)
  return { x, y, vx, vy, life, maxLife: life, color, size }
}

export function spawnHitParticles(
  x: number, y: number, color: string,
): Particle[] {
  return Array.from({ length: 8 }, () =>
    makeParticle(
      x, y,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4 - 1,
      color,
    )
  )
}
