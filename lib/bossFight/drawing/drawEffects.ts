import { Particle, Token } from '@/components/bossFight/types'
import { TOKEN_W, TOKEN_H, C } from '@/components/bossFight/constants'

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    const alpha = p.life / p.maxLife
    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
  }
  ctx.globalAlpha = 1
}

export function drawTokens(ctx: CanvasRenderingContext2D, tokens: Token[]): void {
  for (const t of tokens) {
    const tx = Math.round(t.x)
    const ty = Math.round(t.y)

    // Soft glow (larger transparent rect behind)
    ctx.globalAlpha = 0.25
    ctx.fillStyle = C.amber
    ctx.fillRect(tx - TOKEN_W / 2 - 4, ty - TOKEN_H / 2 - 4, TOKEN_W + 8, TOKEN_H + 8)
    ctx.globalAlpha = 1

    // Coin body
    ctx.fillStyle = C.amber
    ctx.fillRect(tx - TOKEN_W / 2, ty - TOKEN_H / 2, TOKEN_W, TOKEN_H)

    // "+" symbol
    ctx.fillStyle = '#070711'
    ctx.fillRect(tx - 1, ty - TOKEN_H / 2 + 3, 2, TOKEN_H - 6)
    ctx.fillRect(tx - TOKEN_W / 2 + 3, ty - 1, TOKEN_W - 6, 2)
  }
}

export function getShakeOffset(shake: number): { dx: number; dy: number } {
  if (shake <= 0) return { dx: 0, dy: 0 }
  const mag = Math.min(shake, 8)
  return {
    dx: Math.round((Math.random() - 0.5) * 2 * mag),
    dy: Math.round((Math.random() - 0.5) * 2 * mag),
  }
}
