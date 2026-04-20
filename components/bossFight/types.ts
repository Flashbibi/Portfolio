export interface Cat {
  x: number
  y: number
  lane: number
  hp: number
  iframes: number
  animFrame: number
  animTick: number
  armed: boolean
  shootCooldown: number
}

export interface Bug {
  id: number
  x: number
  y: number
  lane: number
  wobblePhase: number
  type: 'normal' | 'fast'
  label: string
  hp: number
}

export interface Token {
  id: number
  x: number
  lane: number
  y: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export interface Powerup {
  x: number
  y: number
  targetLane: number
  retargetTimer: number
  glowPhase: number
}

export interface PlayerBullet {
  id: number
  x: number   // center-x
  y: number   // center-y
  lane: number
}

export interface BossBullet {
  id: number
  x: number   // center-x
  y: number   // center-y
  lane: number
  speed: number
}

export interface Boss {
  x: number       // fixed left edge
  y: number       // current center-y (bobs)
  hp: number
  maxHp: number
  phase: 1 | 2 | 3
  shootTimer: number
  bobPhase: number
  flashTimer: number
}

export type GameMode = 'playing' | 'powerup' | 'boss' | 'gameover' | 'victory'
export type WaveSubState = 'active' | 'cooldown' | 'banner'

export interface RunStats {
  tokensCollected:     number
  projectilesCancelled: number
}

export interface GameState {
  mode: GameMode
  wave: 1 | 2
  waveTimer: number
  waveSubState: WaveSubState
  cooldownTimer: number
  bannerTimer: number
  score: number
  cat: Cat
  bugs: Bug[]
  tokens: Token[]
  particles: Particle[]
  spawnTimer: number
  tokenTimer: number
  shake: number
  worldX: number
  nextId: number
  // Boss phase fields
  powerup: Powerup | null
  boss: Boss | null
  playerBullets: PlayerBullet[]
  bossBullets: BossBullet[]
  bossDelay: number   // -1 = not pending; >0 = counting down after powerup pickup
  runStats: RunStats
}
