import type { PanelCut, Placeholder, SfxPos } from '@/components/me/MangaPanel'

export type MePanelSection = 'spread'

/**
 * 40 named slots on a single 12-col × 10-row grid. Row heights mix
 * splash rows with strip rows for a manga double-page rhythm.
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
  | 'p40'

export type MePanelTextKey =
  | 'p11Caption' | 'p25Caption'
  | 'p1Hover' | 'p2Hover' | 'p3Hover' | 'p4Hover' | 'p5Hover'
  | 'p6Hover' | 'p7Hover' | 'p8Hover' | 'p9Hover'
  | 'p12Hover' | 'p13Hover' | 'p14Hover' | 'p15Hover'
  | 'p16Hover' | 'p17Hover' | 'p19Hover' | 'p20Hover'
  | 'p21Hover' | 'p22Hover' | 'p23Hover'
  | 'p26Hover' | 'p27Hover' | 'p28Hover' | 'p29Hover' | 'p30Hover'
  | 'p31Hover' | 'p32Hover' | 'p33Hover' | 'p34Hover' | 'p35Hover'
  | 'p36Hover' | 'p37Hover' | 'p38Hover' | 'p39Hover'

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
  imageObjectPosition?: string
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

  bleed?: boolean
  frameless?: boolean
}

const SUKI = (name: string) => `/me/suki/${name}`
const ME   = (name: string) => `/me/${name}`

export const mePanels: MePanelConfig[] = [
  /* ────────────────────────────────────────────────────────────────
     ROW 1-2 — gemischt: du → hund → katze → du → hund/katze ...
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p1', section: 'spread', slot: 'p1', order: 0,
    image: ME('P1010081.JPG'), priority: true,
    imageObjectPosition: 'center 45%',
    cut: 'tl-br', bleed: true,
    labelKey: 'chefin', labelPos: 'tr',
    hoverSfxKey: 'p1Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p2', section: 'spread', slot: 'p2', order: 1,
    image: ME('P1010103.JPG'),
    imageObjectPosition: 'center 30%',
    labelKey: 'setup', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p2Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p3', section: 'spread', slot: 'p3', order: 2,
    image: ME('Snapchat-49393205.jpg'),
    labelKey: 'coffee', labelPos: 'tl',
    hoverSfxKey: 'p3Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p4', section: 'spread', slot: 'p4', order: 3,
    image: ME('IMG_20250308_133835552.jpg'),
    labelKey: 'gaming', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p4Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p5', section: 'spread', slot: 'p5', order: 4,
    image: ME('P3040170.JPG'),
    imageObjectPosition: 'left center',
    cut: 'blade-r',
    labelKey: 'filament', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p5Hover', hoverSfxPos: 'br',
  },

  /* Pair 1 — diag: extreme close-ups, fill the frame */
  {
    id: 'p6', section: 'spread', slot: 'p6', order: 5,
    image: ME('IMG_20240901_132713893.jpg'),
    imageObjectPosition: 'left top',
    cut: 'diag-ul',
    labelKey: 'print', labelPos: 'tl',
    hoverSfxKey: 'p6Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p7', section: 'spread', slot: 'p7', order: 6,
    image: ME('IMG_20240901_132713893.jpg'),
    cut: 'diag-lr',
    labelKey: 'homelab', labelPos: 'br',
    hoverSfxKey: 'p7Hover', hoverSfxPos: 'tr',
  },
  {
    id: 'p8', section: 'spread', slot: 'p8', order: 7,
    image: ME('IMG_20250118_030910574.jpg'),
    imageObjectPosition: 'center 30%',
    labelKey: 'esp', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p8Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p9', section: 'spread', slot: 'p9', order: 8,
    image: ME('IMG_20250309_154715265.jpg'),
    imageObjectPosition: 'center 22%',
    labelKey: 'network', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p9Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 3 (80) — Streifen: Querformat oder starker Horizont
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p10', section: 'spread', slot: 'p10', order: 9,
    image: ME('P1010092.JPG'),
    imageObjectPosition: 'center 58%',
  },
  {
    id: 'p11', section: 'spread', slot: 'p11', order: 10,
    image: ME('20230702_093951.jpg'),
    imageObjectPosition: 'center top',
    cut: 'slash-top', frameless: true,
    captionKey: 'p11Caption', captionPos: 'bl',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 4-5 — gemischt
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p12', section: 'spread', slot: 'p12', order: 11,
    image: ME('IMG_20240502_152958681.jpg'),
    imageObjectPosition: 'center 35%',
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p12Hover', hoverSfxPos: 'br',
  },

  /* Pair 2 — diag-split: Gesichter die den Frame füllen */
  {
    id: 'p13', section: 'spread', slot: 'p13', order: 12,
    image: ME('P1010083.JPG'),
    cut: 'diag-split-l',
    labelKey: 'lofi', labelPos: 'tl',
    hoverSfxKey: 'p13Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p14', section: 'spread', slot: 'p14', order: 13,
    image: ME('P1010083.JPG'),
    cut: 'diag-split-r',
    labelKey: 'studio', labelPos: 'tr',
    hoverSfxKey: 'p14Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p15', section: 'spread', slot: 'p15', order: 14,
    image: ME('IMG_20250316_160724297.jpg'),
    imageObjectPosition: 'center 35%',
    labelKey: 'manga', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p15Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p16', section: 'spread', slot: 'p16', order: 15,
    image: ME('IMG_20241124_133101182.jpg'),
    imageObjectPosition: 'center 70%',
    cut: 'blade-l',
    labelKey: 'mountains', labelPos: 'tr',
    hoverSfxKey: 'p16Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p17', section: 'spread', slot: 'p17', order: 16,
    image: ME('IMG_20250619_205146799.jpg'),
    imageObjectPosition: 'center 40%',
    labelKey: 'trails', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p17Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p18', section: 'spread', slot: 'p18', order: 17,
    image: ME('IMG_20241113_232710878.jpg'),
    imageObjectPosition: 'center 68%',
  },

  /* Pair 3 — diag: close-ups */
  {
    id: 'p19', section: 'spread', slot: 'p19', order: 18,
    image: ME('P1010062.JPG'),
    cut: 'diag-ul',
    labelKey: 'tinker', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p19Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p20', section: 'spread', slot: 'p20', order: 19,
    image: ME('P1010062.JPG'),
    cut: 'diag-lr',
    labelKey: 'manga', labelPos: 'br', hideLabelUntilHover: true,
    hoverSfxKey: 'p20Hover', hoverSfxPos: 'tr',
  },

  {
    id: 'p21', section: 'spread', slot: 'p21', order: 20,
    image: ME('IMG_20251211_182336245.jpg'),
    imageObjectPosition: 'center 42%',
    labelKey: 'linux', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p21Hover', hoverSfxPos: 'br',
  },

  /* Pair 4 — diag-split: frame-filling close-ups */
  {
    id: 'p22', section: 'spread', slot: 'p22', order: 21,
    image: ME('IMG_20250831_195851011.jpg'),
    imageObjectPosition: 'center 32%',
    cut: 'diag-split-l',
    labelKey: 'lofi', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p22Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p23', section: 'spread', slot: 'p23', order: 22,
    image: ME('IMG_20250831_195851011.jpg'),
    imageObjectPosition: 'center 32%',
    cut: 'diag-split-r',
    labelKey: 'coffee', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p23Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p24', section: 'spread', slot: 'p24', order: 23,
    image: ME('IMG_20250618_200137118.jpg'),
    imageObjectPosition: 'center 38%',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 6 (80) — Landschaft als voller Trennstreifen
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p25', section: 'spread', slot: 'p25', order: 24,
    image: ME('20220602_121150.jpg'),
    cut: 'slash-bottom', frameless: true, halftone: false,
    captionKey: 'p25Caption', captionPos: 'tl',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 7-8 — gemischt: Katzen-Hero + Hund/Katze abwechselnd
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p26', section: 'spread', slot: 'p26', order: 25,
    image: ME('IMG_20260130_171427803.jpg'),
    imageObjectPosition: 'center 30%',
    cut: 'tl-br', bleed: true,
    labelKey: 'manga', labelPos: 'tr',
    hoverSfxKey: 'p26Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p27', section: 'spread', slot: 'p27', order: 26,
    image: ME('20240114_192750.jpg'),
    imageObjectPosition: 'center 62%',
    labelKey: 'homelab', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p27Hover', hoverSfxPos: 'br',
  },

  /* Pair 5 — trap: horizontale Motive bevorzugt */
  {
    id: 'p28', section: 'spread', slot: 'p28', order: 27,
    image: ME('IMG_20260420_195451889.jpg'),
    imageObjectPosition: 'center 65%',
    cut: 'trap-narrow-b',
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p28Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p29', section: 'spread', slot: 'p29', order: 28,
    image: ME('IMG_20250914_131327600.jpg'),
    imageObjectPosition: 'left center',
    cut: 'trap-wide-b',
    labelKey: 'gaming', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p29Hover', hoverSfxPos: 'bl',
  },

  {
    id: 'p30', section: 'spread', slot: 'p30', order: 29,
    image: ME('IMG_20251230_220953113.jpg'),
    imageObjectPosition: 'center 28%',
    labelKey: 'print', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p30Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p31', section: 'spread', slot: 'p31', order: 30,
    image: ME('IMG_20250130_092543198.jpg'),
    cut: 'wedge-l',
    labelKey: 'trails', labelPos: 'tr',
    hoverSfxKey: 'p31Hover', hoverSfxPos: 'bl',
  },

  /* Row 8 continued */
  {
    id: 'p32', section: 'spread', slot: 'p32', order: 31,
    image: ME('IMG_20250406_111632210.jpg'),
    labelKey: 'studio', labelPos: 'tl',
    hoverSfxKey: 'p32Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p33', section: 'spread', slot: 'p33', order: 32,
    image: ME('IMG_20240901_132716927.jpg'),
    imageObjectPosition: 'left 20%',
    labelKey: 'filament', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p33Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p34', section: 'spread', slot: 'p34', order: 33,
    image: ME('IMG_20251229_184207494.jpg'),
    imageObjectPosition: 'center 35%',
    labelKey: 'coffee', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p34Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p35', section: 'spread', slot: 'p35', order: 34,
    image: ME('IMG_20250330_185650160.jpg'),
    imageObjectPosition: 'left center',
    cut: 'blade-r',
    labelKey: 'mountains', labelPos: 'tl',
    hoverSfxKey: 'p35Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 9 (150) — narration + pair + mediums  [leer — noch offen]
     ──────────────────────────────────────────────────────────────── */

  /* Pair 6 — row 9, cols 4-5: kitten huge eyes split */
  {
    id: 'p36', section: 'spread', slot: 'p36', order: 35,
    image: ME('IMG_20250406_111635317.jpg'),
    imageObjectPosition: 'center 40%',
    cut: 'diag-split-l',
    labelKey: 'network', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p36Hover', hoverSfxPos: 'bl',
  },
  {
    id: 'p37', section: 'spread', slot: 'p37', order: 36,
    image: ME('IMG_20250406_111635317.jpg'),
    imageObjectPosition: 'center 40%',
    cut: 'diag-split-r',
    labelKey: 'linux', labelPos: 'tr', hideLabelUntilHover: true,
    hoverSfxKey: 'p37Hover', hoverSfxPos: 'br',
  },

  {
    id: 'p38', section: 'spread', slot: 'p38', order: 37,
    image: ME('IMG_20250914_131322317.jpg'),
    imageObjectPosition: 'center 28%',
    labelKey: 'anime', labelPos: 'tl', hideLabelUntilHover: true,
    hoverSfxKey: 'p38Hover', hoverSfxPos: 'br',
  },
  {
    id: 'p39', section: 'spread', slot: 'p39', order: 38,
    image: ME('IMG_20250503_163210101.jpg'),
    labelKey: 'coffee', labelPos: 'tl',
    hoverSfxKey: 'p39Hover', hoverSfxPos: 'br',
  },

  /* ────────────────────────────────────────────────────────────────
     ROW 10 (150) — mixed small panels + strips
     ──────────────────────────────────────────────────────────────── */
  {
    id: 'p40', section: 'spread', slot: 'p40', order: 39,
    image: ME('20230512_154033.jpg'),
    imageObjectPosition: 'center 38%',
    bleed: true,
  },
]

export function getMePanelsBySection(section: MePanelSection): MePanelConfig[] {
  return mePanels.filter(p => p.section === section)
}
