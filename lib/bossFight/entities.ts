import { Cat, Bug, Token, Particle, Boss, Powerup, PlayerBullet, BossBullet } from '@/components/bossFight/types'
import {
  CAT_X, CAT_HP, LANES,
  BOSS_HP, BOSS_PHASE_1_COOLDOWN,
  PLAYER_BULLET_W, BOSS_BULLET_W,
  CW,
} from '@/components/bossFight/constants'

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

export function spawnBurstParticles(
  x: number, y: number, color: string, count: number,
): Particle[] {
  return Array.from({ length: count }, () =>
    makeParticle(
      x, y,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6 - 2,
      color,
    )
  )
}

export function makePowerup(): Powerup {
  return {
    x:             CW + PLAYER_BULLET_W,
    y:             LANES[1],
    targetLane:    1,
    retargetTimer: 0,
    glowPhase:     0,
  }
}

export function makePlayerBullet(
  id: number, x: number, y: number, lane: number,
): PlayerBullet {
  return { id, x, y, lane }
}

export function makeBossBullet(
  id: number, x: number, lane: number, speed: number,
): BossBullet {
  return { id, x, y: LANES[lane], lane, speed }
}

export function makeBoss(): Boss {
  return {
    x:          CW - 160,
    y:          LANES[1] - 20,
    hp:         BOSS_HP,
    maxHp:      BOSS_HP,
    phase:      1,
    shootTimer: BOSS_PHASE_1_COOLDOWN,
    bobPhase:   0,
    flashTimer: 0,
  }
}
