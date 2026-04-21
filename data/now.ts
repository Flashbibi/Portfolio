/**
 * Live values for the "Now" section on /me.
 * Update these freely — the component reads straight from this file and
 * neither the layout nor the translations need to change when values do.
 */
export interface MeNow {
  reading:   string
  playing:   string
  building:  string
  listening: string
  learning:  string
}

export const meNow: MeNow = {
  reading:   'Vinland Saga vol. 12',
  playing:   'Elden Ring — second playthrough',
  building:  'this portfolio + a print-farm dashboard',
  listening: 'C418 — one day in October',
  learning:  'Rust (slowly, properly)',
}
