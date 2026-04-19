import { Cat } from '@/components/bossFight/types'
import { C } from '@/components/bossFight/constants'

// Placeholder — replaced in next commit with portfolio sprite
export function drawCat(ctx: CanvasRenderingContext2D, cat: Cat): void {
  if (cat.iframes > 0 && Math.floor(cat.iframes / 6) % 2 === 0) return

  const cx = Math.round(cat.x)
  const cy = Math.round(cat.y)

  // Body (48×40 — matches collision box)
  ctx.fillStyle = C.amber
  ctx.fillRect(cx, cy - 20, 48, 40)

  if (cat.armed) {
    ctx.fillStyle = C.green
    ctx.fillRect(cx + 36, cy - 50, 4, 14)
    ctx.fillRect(cx + 30, cy - 54, 12, 4)
  }
}
