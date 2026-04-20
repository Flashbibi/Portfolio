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
export const CAT_IFRAMES = 32
export const LANE_LERP = 0.5
export const ANIM_PERIOD = 6

export const BUG_W = 22
export const BUG_H = 20
export const BUG_WOBBLE_AMP = 3
export const BUG_WOBBLE_SPEED = 0.12
export const BUG_SPEED_NORMAL = 5.5
export const BUG_SPEED_FAST   = 7.0

export const TOKEN_W = 12
export const TOKEN_H = 12
export const TOKEN_SPEED = 7.5
export const TOKEN_SCORE = 5
export const TOKEN_SPAWN_MIN = 50
export const TOKEN_SPAWN_MAX = 90
export const TOKEN_SAFE_START = 380
export const TOKEN_SAFE_END   = 690

export const WAVE_1_DURATION        = 900
export const WAVE_2_DURATION        = 900
export const WAVE_COOLDOWN_DURATION = 180
export const WAVE_BANNER_DURATION   = 120
export const SPAWN_BASE             = 38
export const SPAWN_MIN       = 22
export const SPAWN_WAVE_DEC  = 8
export const FAST_BUG_CHANCE_W2 = 0.25

export const SHAKE_ON_HIT = 10
export const SHAKE_DECAY  = 1

// --- Powerup ---
export const POWERUP_W                 = 28
export const POWERUP_H                 = 20
export const POWERUP_SPEED             = 5.5
export const POWERUP_HOMING_FACTOR     = 0.06
export const POWERUP_RETARGET_INTERVAL = 12
export const POWERUP_PICKUP_BOSS_DELAY = 24
export const POWERUP_SCORE             = 50

// --- Player bullets ---
export const PLAYER_BULLET_W           = 14
export const PLAYER_BULLET_H           = 6
export const PLAYER_BULLET_SPEED       = 22
export const PLAYER_SHOOT_COOLDOWN     = 6

// --- Boss ---
export const BOSS_W                    = 130
export const BOSS_H                    = 70
export const BOSS_HP                   = 30
export const BOSS_BOB_AMPLITUDE        = 8
export const BOSS_BOB_SPEED            = 0.04
export const BOSS_PHASE_2_THRESHOLD    = 0.66
export const BOSS_PHASE_3_THRESHOLD    = 0.33
export const BOSS_PHASE_FLASH_DURATION = 6
export const BOSS_BULLET_W             = 14
export const BOSS_BULLET_H             = 8
export const BOSS_BULLET_SPEED_SLOW    = 6.5
export const BOSS_BULLET_SPEED_FAST    = 7.5
export const BOSS_PHASE_1_COOLDOWN     = 28
export const BOSS_PHASE_2_COOLDOWN     = 44
export const BOSS_PHASE_3_COOLDOWN     = 34
export const BOSS_DEFEAT_SHAKE         = 25
export const BOSS_HIT_SHAKE            = 8
export const BOSS_SCORE_HIT            = 5
export const BOSS_SCORE_CANCEL         = 3
export const BOSS_SCORE_DEFEAT         = 500

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
  greenDim: '#008c56',
  catFur:  '#ffb547',
  catDark: '#c07818',
  catPink: '#ff6ba0',
} as const
