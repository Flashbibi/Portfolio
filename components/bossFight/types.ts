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

export type GameMode = 'playing' | 'gameover' | 'wave3hold'

export interface GameState {
  mode: GameMode
  wave: 1 | 2
  waveTimer: number
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
}
