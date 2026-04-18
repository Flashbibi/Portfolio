import { glitches, type GlitchEntry } from '@/data/glitches'

type Match = { entry: GlitchEntry; matchStart: number; matchEnd: number }

// Returns all positions where glitch entries match within text.
// Single words use \b word boundaries; multi-word phrases use exact substring.
export function findGlitchCandidates(
  text: string,
  lang: 'de' | 'en'
): Match[] {
  const results: Match[] = []

  for (const entry of glitches[lang]) {
    const { original } = entry

    if (original.includes(' ')) {
      let idx = text.indexOf(original)
      while (idx !== -1) {
        results.push({ entry, matchStart: idx, matchEnd: idx + original.length })
        idx = text.indexOf(original, idx + 1)
      }
    } else {
      const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const re = new RegExp(`\\b${escaped}\\b`, 'g')
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        results.push({ entry, matchStart: m.index, matchEnd: m.index + original.length })
      }
    }
  }

  return results
}

// Picks one glitch to activate from multiple text sources.
// Lightly prefers entries not yet found (3× weight vs 1×).
// Returns null when no candidates exist.
export function pickGlitch(
  sources: Array<{ id: string; text: string }>,
  lang: 'de' | 'en',
  alreadyFound: Set<string>
): {
  sourceId: string
  entry: GlitchEntry
  matchStart: number
  matchEnd: number
} | null {
  type Weighted = Match & { sourceId: string; weight: number }
  const pool: Weighted[] = []

  for (const source of sources) {
    for (const m of findGlitchCandidates(source.text, lang)) {
      pool.push({
        ...m,
        sourceId: source.id,
        weight: alreadyFound.has(m.entry.original) ? 1 : 3,
      })
    }
  }

  if (pool.length === 0) return null

  const total = pool.reduce((s, c) => s + c.weight, 0)
  let r = Math.random() * total

  for (const c of pool) {
    r -= c.weight
    if (r <= 0) return { sourceId: c.sourceId, entry: c.entry, matchStart: c.matchStart, matchEnd: c.matchEnd }
  }

  const last = pool[pool.length - 1]
  return { sourceId: last.sourceId, entry: last.entry, matchStart: last.matchStart, matchEnd: last.matchEnd }
}

// Stable key for tracking found glitches in SessionStorage.
export function glitchKey(entry: GlitchEntry, lang: 'de' | 'en'): string {
  return `${lang}:${entry.original}`
}
