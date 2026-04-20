// Loads /cat-sprite.png and processes it with the same tinting pipeline as AiMascot.
// Call loadCatSprite() once (from BossFightGame useEffect).
// drawCat calls getCatSprite() each frame — returns null while loading.

let sheet: HTMLCanvasElement | null = null
let loading = false

export function getCatSprite(): HTMLCanvasElement | null {
  return sheet
}

export function loadCatSprite(): void {
  if (sheet || loading) return
  loading = true
  const img = new Image()
  img.src = '/cat-sprite.png'
  img.onload = () => {
    sheet   = buildSheet(img)
    loading = false
  }
}

// Identical pipeline to AiMascot.tsx buildSheet:
//   1. Flood-fill background pixels (dark pixels connected to edges → alpha 0)
//   2. Remap remaining pixels to warm amber palette
function buildSheet(img: HTMLImageElement): HTMLCanvasElement {
  const canvas  = document.createElement('canvas')
  canvas.width  = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx     = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)

  const W = canvas.width
  const H = canvas.height
  const imageData = ctx.getImageData(0, 0, W, H)
  const d         = imageData.data

  const isBg  = new Uint8Array(W * H)
  const queue: number[] = []

  const tryAdd = (x: number, y: number) => {
    const ni = y * W + x
    if (isBg[ni]) return
    const pi = ni * 4
    if (d[pi] + d[pi + 1] + d[pi + 2] < 90) { isBg[ni] = 1; queue.push(ni) }
  }

  for (let x = 0; x < W; x++) { tryAdd(x, 0); tryAdd(x, H - 1) }
  for (let y = 1; y < H - 1; y++) { tryAdd(0, y); tryAdd(W - 1, y) }

  while (queue.length) {
    const idx = queue.pop()!
    const cx  = idx % W
    const cy  = (idx / W) | 0
    if (cx > 0)     tryAdd(cx - 1, cy)
    if (cx < W - 1) tryAdd(cx + 1, cy)
    if (cy > 0)     tryAdd(cx, cy - 1)
    if (cy < H - 1) tryAdd(cx, cy + 1)
  }

  for (let i = 0; i < d.length; i += 4) {
    if (isBg[i >> 2]) { d[i + 3] = 0; continue }
    const t  = (d[i] + d[i + 1] + d[i + 2]) / 765
    d[i]     = Math.round(t * 0xd4 + (1 - t) * 0x2d)
    d[i + 1] = Math.round(t * 0xa8 + (1 - t) * 0x1f)
    d[i + 2] = Math.round(t * 0x43 + (1 - t) * 0x00)
    d[i + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}
