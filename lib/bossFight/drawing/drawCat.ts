import { Cat } from '@/components/bossFight/types'
import { C } from '@/components/bossFight/constants'
import { getCatSprite } from '@/lib/bossFight/catSprite'

// Sprite sheet: 32×32 per frame, walk row at y=128, 8 frames.
// Map our 4 game animFrames to every-other walk frame for a clean 4-step cycle.
const FRAME_SIZE  = 32
const DRAW_SIZE   = 64   // 2× scale — sprite rendered at 64×64
const WALK_ROW_Y  = 128
const WALK_FRAMES = [0, 2, 4, 6]  // sprite frame indices for game animFrames 0-3

// Collision box: 48w × 40h centred on cat.y.
// Sprite is drawn at 64×64 — scaled up 2× for legibility as protagonist.
//   draw_x = cat.x − 8       → centres 64px horizontally in the 48px collision box
//   draw_y = cat.y − 44      → aligns sprite bottom with box bottom (cat.y + 20)
const DRAW_OFFSET_X = -8
const DRAW_OFFSET_Y = -44

export function drawCat(ctx: CanvasRenderingContext2D, cat: Cat): void {
  // i-frame blink: skip every other 6-frame window
  if (cat.iframes > 0 && Math.floor(cat.iframes / 6) % 2 === 0) return

  const sprite = getCatSprite()
  if (!sprite) return  // not yet loaded — draw nothing

  const cx = Math.round(cat.x)
  const cy = Math.round(cat.y)

  const spriteFrameCol = WALK_FRAMES[cat.animFrame]
  const sx = spriteFrameCol * FRAME_SIZE
  const sy = WALK_ROW_Y

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    sprite,
    sx, sy, FRAME_SIZE, FRAME_SIZE,
    cx + DRAW_OFFSET_X, cy + DRAW_OFFSET_Y, DRAW_SIZE, DRAW_SIZE,
  )

  // Armed state: green antenna above sprite head
  if (cat.armed) {
    ctx.fillStyle = C.green
    ctx.fillRect(cx + 36, cy - 50, 4, 14)
    ctx.fillRect(cx + 30, cy - 54, 12, 4)
  }
}
