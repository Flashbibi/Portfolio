// All time values are in frames at 60fps. Movement values are in pixels per 60fps-frame.
// The game loop scales by delta-time so behaviour is identical on any refresh rate.

export const CW = 640
export const CH = 360
export const LANES = [150, 215, 280] as const
export const GROUND_Y = 325
export const WORLD_W = 1600
export const BG_SCROLL_SPEED = 1.5

export const CAT_X = 90
export const CAT_W = 56
export const CAT_H = 48
export const CAT_HP = 3
export const CAT_IFRAMES = 80
export const LANE_LERP = 0.3
export const ANIM_PERIOD = 6

export const BUG_W = 22
export const BUG_H = 20
export const BUG_WOBBLE_AMP = 3
export const BUG_WOBBLE_SPEED = 0.12
export const BUG_SPEED_NORMAL = 2.2
export const BUG_SPEED_FAST   = 3.6

export const TOKEN_W = 12
export const TOKEN_H = 12
export const TOKEN_SPEED = 3
export const TOKEN_SCORE = 5
export const TOKEN_SPAWN_MIN = 50
export const TOKEN_SPAWN_MAX = 90
export const TOKEN_SAFE_START = 380
export const TOKEN_SAFE_END   = 690

export const WAVE_1_DURATION = 540
export const WAVE_2_DURATION = 600
export const SPAWN_BASE      = 95
export const SPAWN_MIN       = 55
export const SPAWN_WAVE_DEC  = 8
export const FAST_BUG_CHANCE_W2 = 0.30

export const SHAKE_ON_HIT = 10
export const SHAKE_DECAY  = 1

export const C = {
  bg:      '#070711',
  bgDeep:  '#0d0d1f',
  cyan:    '#00d9ff',
  cyanDim: '#0088aa',
  magenta: '#ff2975',
  magDim:  '#9e1a49',
  green:   '#00ff9f',
  amber:   '#ffb547',
  red:     '#ff3355',
  redDim:  '#991b2e',
  white:   '#e8e8ff',
  catFur:  '#ffb547',
  catDark: '#c07818',
  catPink: '#ff6ba0',
} as const
