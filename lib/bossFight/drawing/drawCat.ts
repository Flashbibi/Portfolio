import { Cat } from '@/components/bossFight/types'
import { C } from '@/components/bossFight/constants'
import { getCatSprite } from '@/lib/bossFight/catSprite'

// Sprite sheet: 32×32 per frame, walk row at y=128, 8 frames.
// Map our 4 game animFrames to every-other walk frame for a clean 4-step cycle.
const FRAME_SIZE  = 32
const DRAW_SIZE   = 96   // 3× scale — sprite rendered at 96×96
const WALK_ROW_Y  = 128
const WALK_FRAMES = [0, 2, 4, 6]  // sprite frame indices for game animFrames 0-3

// Collision box: 56w × 48h centred on cat.y.
// Sprite is drawn at 96×96 — scaled up 3× so she reads as protagonist on the 640×360 canvas.
//   draw_x = cat.x − 20      → centres 96px horizontally in the 56px collision box
//   draw_y = cat.y − 72      → aligns sprite bottom with box bottom (cat.y + 24)
const DRAW_OFFSET_X = -20
const DRAW_OFFSET_Y = -72

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
    ctx.fillRect(cx + 42, cy - 76, 6, 20)
    ctx.fillRect(cx + 36, cy - 80, 18, 6)
  }
}
