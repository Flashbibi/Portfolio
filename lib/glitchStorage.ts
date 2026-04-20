export const GLITCH_FOUND_KEY = 'portfolio:glitches-found'
export const GLITCH_SHOWN_KEY = 'portfolio:glitches-shown'

// ── Found (clicked) ──────────────────────────────────────────────────────────

export function getFoundGlitches(): Set<string> {
  try {
    const raw = sessionStorage.getItem(GLITCH_FOUND_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function markGlitchFound(key: string): void {
  try {
    const found = getFoundGlitches()
    found.add(key)
    sessionStorage.setItem(GLITCH_FOUND_KEY, JSON.stringify(Array.from(found)))
  } catch {
    // SSR or private mode — no-op
  }
}

export function getFoundCount(): number {
  return getFoundGlitches().size
}

// ── Shown (displayed but not clicked — prevents immediate re-pick) ───────────

export function getShownGlitches(): Set<string> {
  try {
    const raw = sessionStorage.getItem(GLITCH_SHOWN_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function markGlitchShown(key: string): void {
  try {
    const shown = getShownGlitches()
    shown.add(key)
    sessionStorage.setItem(GLITCH_SHOWN_KEY, JSON.stringify(Array.from(shown)))
  } catch {
    // SSR or private mode — no-op
  }
}

// ── Combined set for pickGlitch's alreadyFound parameter ─────────────────────

export function getAllSeenGlitches(): Set<string> {
  const found = getFoundGlitches()
  const shown = getShownGlitches()
  const combined = new Set(found)
  shown.forEach(k => combined.add(k))
  return combined
}
