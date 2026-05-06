import type { MeSubject } from './me-panels'

export interface SubjectIntro {
  /** Big banner shouted at the viewer. */
  name: string
  /** Smaller line that follows the banner — sets the vibe. */
  tagline: string
  /** Accent colour for the speed-line burst + name underline. */
  accent: string
  /** Hero portrait when the subject is invoked from a panel that doesn't
   *  carry a great solo shot — falls back to the clicked panel's image
   *  when omitted. */
  heroImage?: string
  /** Object-position for the hero zoom. */
  heroObjectPosition?: string
  /** "Player Pokémon" shown on the bottom-left platform of the battle scene. */
  playerImage?: string
  playerName?: string
  playerObjectPosition?: string
  playerLevel?: number
  /** Wild-side level shown next to the wild HP box. */
  level?: number
}

export const meSubjects: Record<MeSubject, SubjectIntro> = {
  nala: {
    name: 'NALA',
    tagline: 'THE BOSS HAS ARRIVED',
    accent: '#a855f7',
    heroImage: '/me/IMG_20251211_182336245.jpg',
    heroObjectPosition: 'center 30%',
    level: 4,
    playerImage: '/me/IMG_20240502_152958681.jpg',
    playerName: 'ELLI',
    playerObjectPosition: 'center 35%',
    playerLevel: 5,
  },
}
