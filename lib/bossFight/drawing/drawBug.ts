import { Bug } from '@/components/bossFight/types'
import { BUG_W, BUG_H, BUG_WOBBLE_AMP, C } from '@/components/bossFight/constants'

export function drawBug(ctx: CanvasRenderingContext2D, bug: Bug): void {
  const bx = Math.round(bug.x)
  const by = Math.round(bug.y + Math.sin(bug.wobblePhase) * BUG_WOBBLE_AMP)

  const bodyColor = bug.type === 'fast' ? C.red : C.magenta
  const dimColor  = bug.type === 'fast' ? C.redDim : '#9e1a49'

  // Body
  ctx.fillStyle = bodyColor
  ctx.fillRect(bx, by - BUG_H / 2, BUG_W, BUG_H)

  // Dark inner rect (gives it a "broken window" look)
  ctx.fillStyle = dimColor
  ctx.fillRect(bx + 3, by - BUG_H / 2 + 3, BUG_W - 6, BUG_H - 6)

  // Antennae
  ctx.fillStyle = bodyColor
  ctx.fillRect(bx + 4,  by - BUG_H / 2 - 4, 2, 4)
  ctx.fillRect(bx + 14, by - BUG_H / 2 - 4, 2, 4)

  // Legs (3 per side, tiny)
  ctx.fillStyle = bodyColor
  for (let i = 0; i < 3; i++) {
    const lx = bx - 3
    const rx = bx + BUG_W + 1
    const ly = by - 6 + i * 5
    ctx.fillRect(lx, ly, 3, 1)
    ctx.fillRect(rx, ly, 3, 1)
  }

  // Label above bug
  ctx.save()
  ctx.globalAlpha = 0.55
  ctx.fillStyle = C.white
  ctx.font = '8px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(bug.label, bx + BUG_W / 2, by - BUG_H / 2 - 7)
  ctx.restore()
}
