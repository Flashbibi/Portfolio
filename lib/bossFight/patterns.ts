// Singles weighted 6×, doubles 3× — 9 patterns total matching spec
const PATTERNS: number[][] = [
  [0], [1], [2], [0], [1], [2],
  [0, 1], [1, 2], [0, 2],
]

export function pickPattern(): number[] {
  return PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
}
