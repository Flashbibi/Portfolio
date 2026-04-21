import type { PanelCut, Placeholder, SfxPos } from '@/components/me/MangaPanel'

export type MePanelSection = 'spread' | 'spread2'

/**
 * Named slots — each maps to a CSS class in app/me/page.module.css that sets
 * an explicit grid-area on the owning section grid (.spread or .spread2).
 * Multiple slots can share the same grid-area: diagonal pairs stack and
 * divide the cell via complementary clip-paths.
 */
export type MePanelSlot =
  | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7'
  | 'p8' | 'p9' | 'p10' | 'p11' | 'p12' | 'p13'
  | 'p14' | 'p15' | 'p16' | 'p17' | 'p18'
  | 'p19' | 'p20' | 'p21'

export type MePanelTextKey =
  | 'p1Caption' | 'p13Caption' | 'p14Caption' | 'p21Caption'
  | 'p1Hover' | 'p2Hover' | 'p3Hover' | 'p4Hover' | 'p5Hover'
  | 'p6Hover' | 'p7Hover' | 'p8Hover' | 'p9Hover' | 'p10Hover'
  | 'p11Hover' | 'p12Hover' | 'p13Hover' | 'p14Hover' | 'p15Hover'
  | 'p16Hover' | 'p17Hover' | 'p18Hover' | 'p19Hover' | 'p20Hover' | 'p21Hover'

export type MeLabelKey =
  | 'chefin' | 'setup' | 'print' | 'filament' | 'gaming' | 'coffee'
  | 'homelab' | 'network' | 'esp' | 'anime' | 'manga'
  | 'mountains' | 'lofi' | 'studio' | 'trails' | 'linux' | 'tinker'

export interface MePanelConfig {
  id: string
  section: MePanelSection
  slot: MePanelSlot
  order: number

  /* Image path relative to /public (e.g. '/me/suki/…jpg'). Placeholder used
     as fallback when image is unset — useful while real assets arrive. */
  image?: string
  imageAlt?: string
  placeholder?: Placeholder
  /** Mark the top-most above-the-fold panels for Next.js Image priority. */
  priority?: boolean

  cut?: PanelCut
  halftone?: boolean

  /** Big categorial tag (e.g. DIE CHEFIN, SETUP). Signals what this panel
      is supposed to become when real assets replace the Suki placeholders. */
  labelKey?: MeLabelKey
  labelPos?: SfxPos

  /** Small // mono comment — used only on the establishing strips. */
  captionKey?: MePanelTextKey
  captionPos?: SfxPos

  hoverSfxKey?: MePanelTextKey
  hoverSfxPos?: SfxPos
}

/* ── Placeholder image pool — Suki photos from public/me/suki/ ─────────
   Swap per-panel later once real categorised shots arrive; the layout
   code never touches these strings. */
const SUKI = (name: string) => `/me/suki/${name}`

export const mePanels: MePanelConfig[] = [
  /* ────────────────────────────────────────────────────────────────
     SPREAD 1 — character establishing shots (rows 1-7 of .spread)
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p1', section: 'spread', slot: 'p1', order: 0,
    image: SUKI('20220210_174553.jpg'), priority: true,
    captionKey: 'p1Caption', captionPos: 'tl',
    hoverSfxKey: 'p1Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p2', section: 'spread', slot: 'p2', order: 1,
    image: SUKI('20230320_130507.jpg'), priority: true,
    cut: 'tl-br',
    labelKey: 'chefin', labelPos: 'tr',
    hoverSfxKey: 'p2Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p3', section: 'spread', slot: 'p3', order: 2,
    image: SUKI('20220424_104354.jpg'),
    cut: 'trap-tall',
    labelKey: 'setup', labelPos: 'tl',
    hoverSfxKey: 'p3Hover', hoverSfxPos: 'br',
  },

  /* Pair 1 — rows 2-3, cols 7-12, cross-diagonal split */
  {
    id: 'p4', section: 'spread', slot: 'p4', order: 3,
    image: SUKI('20220415_142338.jpg'),
    cut: 'diag-ul',
    labelKey: 'print', labelPos: 'tl',
    hoverSfxKey: 'p4Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p5', section: 'spread', slot: 'p5', order: 4,
    image: SUKI('20220415_142445.jpg'),
    cut: 'diag-lr',
    labelKey: 'filament', labelPos: 'br',
    hoverSfxKey: 'p5Hover', hoverSfxPos: 'tr',
  },

  /* Pair 2 — row 4, cols 7-12, vertical trapezoid split */
  {
    id: 'p6', section: 'spread', slot: 'p6', order: 5,
    image: SUKI('20220506_192304.jpg'),
    cut: 'trap-narrow-b',
    labelKey: 'gaming', labelPos: 'tl',
    hoverSfxKey: 'p6Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p7', section: 'spread', slot: 'p7', order: 6,
    image: SUKI('20220506_192323.jpg'),
    cut: 'trap-wide-b',
    labelKey: 'coffee', labelPos: 'tr',
    hoverSfxKey: 'p7Hover', hoverSfxPos: 'bl',
  },

  /* Pair 3 — rows 5-6, cols 1-6, horizontal slanted split */
  {
    id: 'p8', section: 'spread', slot: 'p8', order: 7,
    image: SUKI('20220507_180256.jpg'),
    cut: 'split-top',
    labelKey: 'homelab', labelPos: 'tl',
    hoverSfxKey: 'p8Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p9', section: 'spread', slot: 'p9', order: 8,
    image: SUKI('20220507_181950.jpg'),
    cut: 'split-bottom',
    labelKey: 'network', labelPos: 'bl',
    hoverSfxKey: 'p9Hover', hoverSfxPos: 'tr',
  },

  {
    id: 'p10', section: 'spread', slot: 'p10', order: 9,
    image: SUKI('20220511_215118.jpg'),
    labelKey: 'esp', labelPos: 'tl',
    hoverSfxKey: 'p10Hover', hoverSfxPos: 'br',
  },

  /* Pair 4 — rows 5-6, cols 8-12, mirrored vertical split */
  {
    id: 'p11', section: 'spread', slot: 'p11', order: 10,
    image: SUKI('20220522_152049.jpg'),
    cut: 'diag-split-l',
    labelKey: 'anime', labelPos: 'tl',
    hoverSfxKey: 'p11Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p12', section: 'spread', slot: 'p12', order: 11,
    image: SUKI('20220811_162341.jpg'),
    cut: 'diag-split-r',
    labelKey: 'manga', labelPos: 'tr',
    hoverSfxKey: 'p12Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p13', section: 'spread', slot: 'p13', order: 12,
    image: SUKI('20230512_154034.jpg'),
    cut: 'slash-top',
    captionKey: 'p13Caption', captionPos: 'bl',
    hoverSfxKey: 'p13Hover', hoverSfxPos: 'tr',
  },

  /* ────────────────────────────────────────────────────────────────
     SPREAD 2 — off-screen interests (rows 1-5 of .spread2)
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p14', section: 'spread2', slot: 'p14', order: 0,
    image: SUKI('20231224_110714.jpg'),
    cut: 'slash-bottom',
    captionKey: 'p14Caption', captionPos: 'tl',
    hoverSfxKey: 'p14Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p15', section: 'spread2', slot: 'p15', order: 1,
    image: SUKI('20240114_192705.jpg'),
    cut: 'tl-br',
    labelKey: 'mountains', labelPos: 'tr',
    hoverSfxKey: 'p15Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p16', section: 'spread2', slot: 'p16', order: 2,
    image: SUKI('20240128_151243.jpg'),
    cut: 'wedge-l',
    labelKey: 'lofi', labelPos: 'tl',
    hoverSfxKey: 'p16Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p17', section: 'spread2', slot: 'p17', order: 3,
    image: SUKI('IMG_20240321_103229148.jpg'),
    cut: 'trap-tall',
    labelKey: 'studio', labelPos: 'tl',
    hoverSfxKey: 'p17Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p18', section: 'spread2', slot: 'p18', order: 4,
    image: SUKI('20220409_172847.jpg'),
    cut: 'notch-br',
    labelKey: 'trails', labelPos: 'tl',
    hoverSfxKey: 'p18Hover', hoverSfxPos: 'tr',
  },

  /* Pair 5 — row 4, cols 5-9, mirrored vertical split */
  {
    id: 'p19', section: 'spread2', slot: 'p19', order: 5,
    image: SUKI('20230702_093947.jpg'),
    cut: 'diag-split-l',
    labelKey: 'linux', labelPos: 'tl',
    hoverSfxKey: 'p19Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p20', section: 'spread2', slot: 'p20', order: 6,
    image: SUKI('20240114_192750.jpg'),
    cut: 'diag-split-r',
    labelKey: 'tinker', labelPos: 'tr',
    hoverSfxKey: 'p20Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p21', section: 'spread2', slot: 'p21', order: 7,
    image: SUKI('20220522_152309.jpg'),
    cut: 'slash-top',
    captionKey: 'p21Caption', captionPos: 'bl',
    hoverSfxKey: 'p21Hover', hoverSfxPos: 'tr',
  },
]

export function getMePanelsBySection(section: MePanelSection): MePanelConfig[] {
  return mePanels.filter(p => p.section === section)
}
