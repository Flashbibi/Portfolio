import { PlayerBullet, BossBullet } from '@/components/bossFight/types'
import { PLAYER_BULLET_W, PLAYER_BULLET_H, BOSS_BULLET_W, BOSS_BULLET_H, C } from '@/components/bossFight/constants'

export function drawPlayerBullets(ctx: CanvasRenderingContext2D, bullets: PlayerBullet[]): void {
  ctx.fillStyle = C.green
  for (const b of bullets) {
    ctx.fillRect(
      Math.round(b.x - PLAYER_BULLET_W / 2),
      Math.round(b.y - PLAYER_BULLET_H / 2),
      PLAYER_BULLET_W,
      PLAYER_BULLET_H,
    )
  }
}

export function drawBossBullets(ctx: CanvasRenderingContext2D, bullets: BossBullet[]): void {
  for (const b of bullets) {
    const bx = Math.round(b.x - BOSS_BULLET_W / 2)
    const by = Math.round(b.y - BOSS_BULLET_H / 2)
    // Outer (red)
    ctx.fillStyle = C.red
    ctx.fillRect(bx, by, BOSS_BULLET_W, BOSS_BULLET_H)
    // Bright core
    ctx.fillStyle = '#ff8888'
    ctx.fillRect(bx + 2, by + 1, BOSS_BULLET_W - 4, BOSS_BULLET_H - 2)
  }
}
