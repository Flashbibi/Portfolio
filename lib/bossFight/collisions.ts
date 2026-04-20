import { Cat, Bug, Token, Boss, PlayerBullet, BossBullet, Powerup } from '@/components/bossFight/types'
import {
  CAT_W, CAT_H,
  BUG_W, BUG_H,
  TOKEN_W, TOKEN_H,
  BOSS_W, BOSS_H,
  PLAYER_BULLET_W, PLAYER_BULLET_H,
  BOSS_BULLET_W, BOSS_BULLET_H,
  POWERUP_W, POWERUP_H,
} from '@/components/bossFight/constants'

export function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

function catRect(cat: Cat) {
  return { x: cat.x, y: cat.y - CAT_H / 2, w: CAT_W, h: CAT_H }
}

export function catHitsBug(cat: Cat, bug: Bug): boolean {
  const c = catRect(cat)
  return aabb(c.x, c.y, c.w, c.h, bug.x, bug.y - BUG_H / 2, BUG_W, BUG_H)
}

export function catHitsToken(cat: Cat, token: Token): boolean {
  const c = catRect(cat)
  return aabb(c.x, c.y, c.w, c.h, token.x - TOKEN_W / 2, token.y - TOKEN_H / 2, TOKEN_W, TOKEN_H)
}

export function catHitsPowerup(cat: Cat, powerup: Powerup): boolean {
  const c = catRect(cat)
  return aabb(
    c.x, c.y, c.w, c.h,
    powerup.x - POWERUP_W / 2, powerup.y - POWERUP_H / 2, POWERUP_W, POWERUP_H,
  )
}

export function playerBulletHitsBoss(b: PlayerBullet, boss: Boss): boolean {
  return aabb(
    b.x - PLAYER_BULLET_W / 2, b.y - PLAYER_BULLET_H / 2, PLAYER_BULLET_W, PLAYER_BULLET_H,
    boss.x, boss.y - BOSS_H / 2, BOSS_W, BOSS_H,
  )
}

export function playerBulletHitsBossBullet(pb: PlayerBullet, bb: BossBullet): boolean {
  return aabb(
    pb.x - PLAYER_BULLET_W / 2, pb.y - PLAYER_BULLET_H / 2, PLAYER_BULLET_W, PLAYER_BULLET_H,
    bb.x - BOSS_BULLET_W / 2,   bb.y - BOSS_BULLET_H / 2,   BOSS_BULLET_W,   BOSS_BULLET_H,
  )
}

export function catHitsBossBullet(cat: Cat, bb: BossBullet): boolean {
  const c = catRect(cat)
  return aabb(
    c.x, c.y, c.w, c.h,
    bb.x - BOSS_BULLET_W / 2, bb.y - BOSS_BULLET_H / 2, BOSS_BULLET_W, BOSS_BULLET_H,
  )
}
