import type { PanelCut, Placeholder, SfxPos } from '@/components/me/MangaPanel'

export type MePanelSection = 'spread'

/**
 * 41 named slots on a single 12-col × 11-row grid. Row heights vary
 * (140 140 80 150 150 80 150 150 150 150 130 px) to mix splash rows
 * with narrow strip rows — closer to how a manga double-page breathes.
 *
 * Slots p6/p7, p13/p14, p19/p20, p22/p23, p28/p29, p36/p37 share a
 * grid-area: diagonal pairs stacked with complementary clip-paths.
 */
export type MePanelSlot =
  | 'p1'  | 'p2'  | 'p3'  | 'p4'  | 'p5'
  | 'p6'  | 'p7'  | 'p8'  | 'p9'
  | 'p10' | 'p11'
  | 'p12' | 'p13' | 'p14' | 'p15' | 'p16' | 'p17' | 'p18'
  | 'p19' | 'p20' | 'p21' | 'p22' | 'p23' | 'p24'
  | 'p25'
  | 'p26' | 'p27' | 'p28' | 'p29' | 'p30' | 'p31'
  | 'p32' | 'p33' | 'p34' | 'p35'
  | 'p36' | 'p37' | 'p38' | 'p39'
  | 'p40' | 'p41'

export type MePanelTextKey =
  | 'p11Caption' | 'p25Caption' | 'p41Caption'
  | 'p1Hover' | 'p2Hover' | 'p3Hover' | 'p4Hover' | 'p5Hover'
  | 'p6Hover' | 'p7Hover' | 'p8Hover' | 'p9Hover' | 'p10Hover'
  | 'p11Hover' | 'p12Hover' | 'p13Hover' | 'p14Hover' | 'p15Hover'
  | 'p16Hover' | 'p17Hover' | 'p18Hover' | 'p19Hover' | 'p20Hover'
  | 'p21Hover' | 'p22Hover' | 'p23Hover' | 'p24Hover' | 'p25Hover'
  | 'p26Hover' | 'p27Hover' | 'p28Hover' | 'p29Hover' | 'p30Hover'
  | 'p31Hover' | 'p32Hover' | 'p33Hover' | 'p34Hover' | 'p35Hover'
  | 'p36Hover' | 'p37Hover' | 'p38Hover' | 'p39Hover'
  | 'p40Hover' | 'p41Hover'

export type MeLabelKey =
  | 'chefin' | 'setup' | 'print' | 'filament' | 'gaming' | 'coffee'
  | 'homelab' | 'network' | 'esp' | 'anime' | 'manga'
  | 'mountains' | 'lofi' | 'studio' | 'trails' | 'linux' | 'tinker'

export interface MePanelConfig {
  id: string
  section: MePanelSection
  slot: MePanelSlot
  order: number

  image?: string
  imageAlt?: string
  placeholder?: Placeholder
  priority?: boolean

  cut?: PanelCut
  halftone?: boolean

  labelKey?: MeLabelKey
  labelPos?: SfxPos
  /** For small panels — label only appears on hover, alongside hoverSfx. */
  hideLabelUntilHover?: boolean

  captionKey?: MePanelTextKey
  captionPos?: SfxPos

  hoverSfxKey?: MePanelTextKey
  hoverSfxPos?: SfxPos
}

const SUKI = (name: string) => `/me/suki/${name}`

export const mePanels: MePanelConfig[] = [
  /* ────────────────────────────────────────────────────────────────
     ROW 1-2 (140 + 140) — Hero splash + top row
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p1', section: 'spread', slot: 'p1', order: 0,
    image: SUKI('20230320_130507.jpg'), priority: true,
    cut: 'tl-br',
    labelKey: 'chefin', labelPos: 'tr',
    hoverSfxKey: 'p1Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p2', section: 'spread', slot: 'p2', order: 1,
    image: SUKI('20220424_104354.jpg'),
    labelKey: 'setup', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p2Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p3', section: 'spread', slot: 'p3', order: 2,
    image: SUKI('20220506_192323.jpg'),
    labelKey: 'coffee', labelPos: 'tl',
    hoverSfxKey: 'p3Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p4', section: 'spread', slot: 'p4', order: 3,
    image: SUKI('20220506_192304.jpg'),
    labelKey: 'gaming', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p4Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p5', section: 'spread', slot: 'p5', order: 4,
    image: SUKI('20220415_142445.jpg'),
    cut: 'trap-tall',
    labelKey: 'filament', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p5Hover', hoverSfxPos: 'br',
  },

  /* Pair 1 — row 2, cols 5-7, cross-diagonal */
  {
    id: 'p6', section: 'spread', slot: 'p6', order: 5,
    image: SUKI('20220415_142338.jpg'),
    cut: 'diag-ul',
    labelKey: 'print', labelPos: 'tl',
    hoverSfxKey: 'p6Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p7', section: 'spread', slot: 'p7', order: 6,
    image: SUKI('20220507_180256.jpg'),
    cut: 'diag-lr',
    labelKey: 'homelab', labelPos: 'br',
    hoverSfxKey: 'p7Hover', hoverSfxPos: 'tr',
  },
  {
    id: 'p8', section: 'spread', slot: 'p8', order: 7,
    image: SUKI('20220511_215118.jpg'),
    labelKey: 'esp', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p8Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p9', section: 'spread', slot: 'p9', order: 8,
    image: SUKI('20220507_181950.jpg'),
    labelKey: 'network', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p9Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 3 (80) — strip row
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p10', section: 'spread', slot: 'p10', order: 9,
    image: SUKI('20220210_174553.jpg'),
    hoverSfxKey: 'p10Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p11', section: 'spread', slot: 'p11', order: 10,
    image: SUKI('20230512_154034.jpg'),
    cut: 'slash-top',
    captionKey: 'p11Caption', captionPos: 'bl',
    hoverSfxKey: 'p11Hover', hoverSfxPos: 'tr',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 4 (150) — small + pair + 2-row medium
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p12', section: 'spread', slot: 'p12', order: 11,
    image: SUKI('20220522_152049.jpg'),
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p12Hover', hoverSfxPos: 'br',
  },

  /* Pair 2 — row 4, cols 3-5, mirrored vertical split */
  {
    id: 'p13', section: 'spread', slot: 'p13', order: 12,
    image: SUKI('20220811_162341.jpg'),
    cut: 'diag-split-l',
    labelKey: 'lofi', labelPos: 'tl',
    hoverSfxKey: 'p13Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p14', section: 'spread', slot: 'p14', order: 13,
    image: SUKI('20240128_151252.jpg'),
    cut: 'diag-split-r',
    labelKey: 'studio', labelPos: 'tr',
    hoverSfxKey: 'p14Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p15', section: 'spread', slot: 'p15', order: 14,
    image: SUKI('20220314_190348.jpg'),
    labelKey: 'manga', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p15Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p16', section: 'spread', slot: 'p16', order: 15,
    image: SUKI('20240114_192705.jpg'),
    cut: 'wedge-l',
    labelKey: 'mountains', labelPos: 'tr',
    hoverSfxKey: 'p16Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p17', section: 'spread', slot: 'p17', order: 16,
    image: SUKI('20220409_172847.jpg'),
    labelKey: 'trails', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p17Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p18', section: 'spread', slot: 'p18', order: 17,
    image: SUKI('20220506_192309.jpg'),
    hoverSfxKey: 'p18Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 5 (150) — narration + pairs + tiny
     ──────────────────────────────────────────────────────────────── */

  /* Pair 3 — row 5, cols 4-5 */
  {
    id: 'p19', section: 'spread', slot: 'p19', order: 18,
    image: SUKI('20240114_192750.jpg'),
    cut: 'diag-ul',
    labelKey: 'tinker', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p19Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p20', section: 'spread', slot: 'p20', order: 19,
    image: SUKI('20230702_093947.jpg'),
    cut: 'diag-lr',
    labelKey: 'manga', labelPos: 'br', hideLabelUntilHover: true,
    hoverSfxKey: 'p20Hover', hoverSfxPos: 'tr',
  },

  {
    id: 'p21', section: 'spread', slot: 'p21', order: 20,
    image: SUKI('20220507_180254.jpg'),
    labelKey: 'linux', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p21Hover', hoverSfxPos: 'br',
  },

  /* Pair 4 — row 5, cols 10-11 */
  {
    id: 'p22', section: 'spread', slot: 'p22', order: 21,
    image: SUKI('20220415_142339.jpg'),
    cut: 'diag-split-l',
    labelKey: 'lofi', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p22Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p23', section: 'spread', slot: 'p23', order: 22,
    image: SUKI('20220522_152049.jpg'),
    cut: 'diag-split-r',
    labelKey: 'coffee', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p23Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p24', section: 'spread', slot: 'p24', order: 23,
    image: SUKI('20230320_130507.jpg'),
    hoverSfxKey: 'p24Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 6 (80) — full-width interlude strip
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p25', section: 'spread', slot: 'p25', order: 24,
    image: SUKI('20231224_110714.jpg'),
    cut: 'slash-bottom',
    captionKey: 'p25Caption', captionPos: 'tl',
    hoverSfxKey: 'p25Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 7-8 (150 + 150) — second splash + surroundings
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p26', section: 'spread', slot: 'p26', order: 25,
    image: SUKI('IMG_20240321_103229148.jpg'),
    cut: 'tl-br',
    labelKey: 'manga', labelPos: 'tr',
    hoverSfxKey: 'p26Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p27', section: 'spread', slot: 'p27', order: 26,
    image: SUKI('20220506_192255.jpg'),
    labelKey: 'homelab', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p27Hover', hoverSfxPos: 'br',
  },

  /* Pair 5 — row 7, cols 6-7, vertical trapezoid */
  {
    id: 'p28', section: 'spread', slot: 'p28', order: 27,
    image: SUKI('20220507_181937.jpg'),
    cut: 'trap-narrow-b',
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p28Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p29', section: 'spread', slot: 'p29', order: 28,
    image: SUKI('20220415_142341.jpg'),
    cut: 'trap-wide-b',
    labelKey: 'gaming', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p29Hover', hoverSfxPos: 'bl',
  },

  {
    id: 'p30', section: 'spread', slot: 'p30', order: 29,
    image: SUKI('20220415_142337.jpg'),
    labelKey: 'print', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p30Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p31', section: 'spread', slot: 'p31', order: 30,
    image: SUKI('IMG_20240530_142028651.jpg'),
    cut: 'wedge-l',
    labelKey: 'trails', labelPos: 'tr',
    hoverSfxKey: 'p31Hover', hoverSfxPos: 'bl',
  },

  /* Row 8 continued */
  {
    id: 'p32', section: 'spread', slot: 'p32', order: 31,
    image: SUKI('20220522_152309.jpg'),
    labelKey: 'studio', labelPos: 'tl',
    hoverSfxKey: 'p32Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p33', section: 'spread', slot: 'p33', order: 32,
    image: SUKI('20220511_215118.jpg'),
    labelKey: 'filament', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p33Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p34', section: 'spread', slot: 'p34', order: 33,
    image: SUKI('20220507_180307.jpg'),
    labelKey: 'coffee', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p34Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p35', section: 'spread', slot: 'p35', order: 34,
    image: SUKI('20240114_192705.jpg'),
    cut: 'trap-tall',
    labelKey: 'mountains', labelPos: 'tl',
    hoverSfxKey: 'p35Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 9 (150) — narration + pair + mediums
     ──────────────────────────────────────────────────────────────── */

  /* Pair 6 — row 9, cols 4-5 */
  {
    id: 'p36', section: 'spread', slot: 'p36', order: 35,
    image: SUKI('20230702_093951.jpg'),
    cut: 'diag-split-l',
    labelKey: 'network', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p36Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p37', section: 'spread', slot: 'p37', order: 36,
    image: SUKI('20240114_192750.jpg'),
    cut: 'diag-split-r',
    labelKey: 'linux', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p37Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p38', section: 'spread', slot: 'p38', order: 37,
    image: SUKI('20220522_152344.jpg'),
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p38Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p39', section: 'spread', slot: 'p39', order: 38,
    image: SUKI('20230322_140508.jpg'),
    labelKey: 'coffee', labelPos: 'tl',
    hoverSfxKey: 'p39Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 10 (150) — mixed small panels + strips
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p40', section: 'spread', slot: 'p40', order: 39,
    image: SUKI('20230225_183222.jpg'),
    hoverSfxKey: 'p40Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p41', section: 'spread', slot: 'p41', order: 40,
    image: SUKI('20230629_181500.jpg'),
    cut: 'slash-top',
    captionKey: 'p41Caption', captionPos: 'bl',
    hoverSfxKey: 'p41Hover', hoverSfxPos: 'tr',
  },
]

export function getMePanelsBySection(section: MePanelSection): MePanelConfig[] {
  return mePanels.filter(p => p.section === section)
}
