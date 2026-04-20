import { Boss } from '@/components/bossFight/types'
import { BOSS_W, BOSS_H, BOSS_PHASE_FLASH_DURATION, C } from '@/components/bossFight/constants'

export function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss): void {
  const bx = Math.round(boss.x)
  const by = Math.round(boss.y - BOSS_H / 2)

  // ── Outer border (all red) ──
  ctx.fillStyle = C.red
  ctx.fillRect(bx, by, BOSS_W, BOSS_H)

  // ── Title bar text ──
  ctx.fillStyle = C.white
  ctx.font = '8px monospace'
  ctx.textBaseline = 'top'
  ctx.fillText('SEGFAULT.exe', bx + 4, by + 3)

  // Close button
  ctx.fillStyle = '#c0c0c0'
  ctx.fillRect(bx + BOSS_W - 14, by + 2, 12, 10)
  ctx.fillStyle = '#000000'
  ctx.font = '7px monospace'
  ctx.fillText('x', bx + BOSS_W - 11, by + 3)

  // ── Body background ──
  ctx.fillStyle = '#0d0005'
  ctx.fillRect(bx + 2, by + 14, BOSS_W - 4, BOSS_H - 16)

  // ── Left eye ──
  ctx.fillStyle = '#1a0000'
  ctx.fillRect(bx + 10, by + 18, 22, 18)         // socket
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 15, by + 22, 12, 10)         // iris
  ctx.fillStyle = '#000000'
  ctx.fillRect(bx + 17, by + 24, 8, 6)           // pupil
  // Left eyebrow (angry: slopes down-left to up-right)
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 10, by + 16, 6, 2)
  ctx.fillRect(bx + 16, by + 15, 6, 2)
  ctx.fillRect(bx + 22, by + 14, 6, 2)

  // ── Right eye ──
  ctx.fillStyle = '#1a0000'
  ctx.fillRect(bx + 98, by + 18, 22, 18)         // socket
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 103, by + 22, 12, 10)        // iris
  ctx.fillStyle = '#000000'
  ctx.fillRect(bx + 105, by + 24, 8, 6)          // pupil
  // Right eyebrow (mirrored)
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 114, by + 16, 6, 2)
  ctx.fillRect(bx + 108, by + 15, 6, 2)
  ctx.fillRect(bx + 102, by + 14, 6, 2)

  // ── Mouth ──
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 8, by + 40, BOSS_W - 16, 22) // mouth bg
  // Teeth: 9 white rectangles
  ctx.fillStyle = C.white
  for (let i = 0; i < 9; i++) {
    ctx.fillRect(bx + 9 + i * 12, by + 41, 9, 14)
  }
  // Gum line (red strip between teeth and mouth bg)
  ctx.fillStyle = C.red
  ctx.fillRect(bx + 8, by + 55, BOSS_W - 16, 7)

  // ── HP bar ──
  const barX = bx
  const barY = by - 10
  ctx.fillStyle = C.redDim
  ctx.fillRect(barX, barY, BOSS_W, 6)
  ctx.fillStyle = C.red
  ctx.fillRect(barX, barY, Math.round(BOSS_W * boss.hp / boss.maxHp), 6)

  // ── Phase transition flash ──
  if (boss.flashTimer > 0) {
    ctx.globalAlpha = 0.75 * (boss.flashTimer / BOSS_PHASE_FLASH_DURATION)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(bx, by, BOSS_W, BOSS_H)
    ctx.globalAlpha = 1
  }

  ctx.textBaseline = 'alphabetic'
}
