import { Powerup } from '@/components/bossFight/types'
import { POWERUP_W, POWERUP_H, C } from '@/components/bossFight/constants'

export function drawPowerup(ctx: CanvasRenderingContext2D, p: Powerup): void {
  const px = Math.round(p.x)
  const py = Math.round(p.y)
  const hw = POWERUP_W / 2
  const hh = POWERUP_H / 2

  // Pulsing glow
  const glowA = 0.18 + 0.14 * Math.sin(p.glowPhase)
  ctx.globalAlpha = glowA
  ctx.fillStyle = C.green
  ctx.fillRect(px - hw - 6, py - hh - 6, POWERUP_W + 12, POWERUP_H + 12)
  ctx.globalAlpha = 1

  // Border
  ctx.fillStyle = C.green
  ctx.fillRect(px - hw, py - hh, POWERUP_W, POWERUP_H)

  // Inner body
  ctx.fillStyle = '#001a0d'
  ctx.fillRect(px - hw + 2, py - hh + 2, POWERUP_W - 4, POWERUP_H - 4)

  // "log" text
  ctx.fillStyle = C.green
  ctx.font = '8px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('log', px, py)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}
