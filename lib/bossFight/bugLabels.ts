const LABELS = [
  'off-by-one',
  'null ref',
  'race condition',
  'NaN',
  'undefined',
  'stack trace',
  'deprecated',
  'unreachable',
  'memory leak',
  'tech debt',
  'typo',
  'regression',
]

export function pickLabel(): string {
  return LABELS[Math.floor(Math.random() * LABELS.length)]
}
