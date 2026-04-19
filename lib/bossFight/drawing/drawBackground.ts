import { CW, CH, LANES, GROUND_Y, WORLD_W, C } from '@/components/bossFight/constants'

// Static circuit-chip positions in world space [wx, wy, w, h, colorKey]
type Chip = [number, number, number, number, string]
const CHIPS: Chip[] = buildChips()

function buildChips(): Chip[] {
  const chips: Chip[] = []
  const rng = mulberry32(0xdeadbeef)

  for (let i = 0; i < 60; i++) {
    const wx = Math.floor(rng() * WORLD_W)
    const wy = Math.floor(rng() * 80) + 10          // top strip above lanes
    const w  = Math.floor(rng() * 10) + 4
    const h  = Math.floor(rng() * 6)  + 2
    const col = rng() > 0.5 ? C.cyanDim : C.bgDeep
    chips.push([wx, wy, w, h, col])
  }
  // Ground chips
  for (let i = 0; i < 40; i++) {
    const wx  = Math.floor(rng() * WORLD_W)
    const wy  = GROUND_Y + 4 + Math.floor(rng() * 28)
    const w   = Math.floor(rng() * 14) + 3
    const h   = Math.floor(rng() * 4)  + 2
    const col = rng() > 0.6 ? C.cyanDim : '#0a0a1a'
    chips.push([wx, wy, w, h, col])
  }
  // Connector lines between lane strips
  for (let i = 0; i < 30; i++) {
    const wx  = Math.floor(rng() * WORLD_W)
    const wy  = 100 + Math.floor(rng() * 200)
    chips.push([wx, wy, Math.floor(rng() * 6) + 1, 1, C.cyanDim])
  }
  return chips
}

// Deterministic pseudo-random so chips don't change between renders
function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, worldX: number): void {
  const snapX = Math.round(worldX) % WORLD_W

  // Base fill
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, CW, CH)

  // Horizon band (top area above lanes)
  ctx.fillStyle = C.bgDeep
  ctx.fillRect(0, 0, CW, 95)

  // Ground band
  ctx.fillStyle = C.bgDeep
  ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y)

  // Ground edge line
  ctx.fillStyle = C.cyanDim
  ctx.fillRect(0, GROUND_Y, CW, 1)

  // Circuit chips — tiled with WORLD_W modulo wrapping
  for (const [wx, wy, w, h, col] of CHIPS) {
    const sx = ((wx - snapX) % WORLD_W + WORLD_W) % WORLD_W
    if (sx < CW + w) {
      ctx.fillStyle = col
      ctx.fillRect(sx, wy, w, h)
    }
  }

  // Lane lines — dashed cyan, one per lane
  ctx.strokeStyle = C.cyanDim
  ctx.lineWidth = 1
  ctx.setLineDash([8, 12])
  ctx.lineDashOffset = -snapX % 20
  for (const ly of LANES) {
    ctx.beginPath()
    ctx.moveTo(0, ly + CAT_H_HALF)
    ctx.lineTo(CW, ly + CAT_H_HALF)
    ctx.stroke()
  }
  ctx.setLineDash([])
}

// Offset used for lane baseline — bottom of cat collision box (CAT_H / 2)
const CAT_H_HALF = 20
