import { Cat, Bug, Token } from '@/components/bossFight/types'
import { CAT_W, CAT_H, BUG_W, BUG_H, TOKEN_W, TOKEN_H } from '@/components/bossFight/constants'

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
