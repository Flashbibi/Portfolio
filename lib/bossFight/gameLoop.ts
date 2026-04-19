import { GameState, GameMode } from '@/components/bossFight/types'
import {
  LANES, LANE_LERP, ANIM_PERIOD,
  CAT_IFRAMES, SHAKE_ON_HIT, SHAKE_DECAY,
  BUG_SPEED_NORMAL, BUG_SPEED_FAST, BUG_WOBBLE_SPEED,
  TOKEN_SPEED, TOKEN_SCORE, TOKEN_SAFE_START, TOKEN_SAFE_END,
  TOKEN_SPAWN_MIN, TOKEN_SPAWN_MAX,
  SPAWN_BASE, SPAWN_MIN, SPAWN_WAVE_DEC, FAST_BUG_CHANCE_W2,
  WAVE_1_DURATION, WAVE_2_DURATION,
  BG_SCROLL_SPEED, CW, CH, C,
  CAT_X, CAT_HP,
} from '@/components/bossFight/constants'
import { makeCat, makeBug, makeToken, spawnHitParticles } from '@/lib/bossFight/entities'
import { catHitsBug, catHitsToken } from '@/lib/bossFight/collisions'
import { pickPattern } from '@/lib/bossFight/patterns'
import { pickLabel } from '@/lib/bossFight/bugLabels'
import { drawBackground } from '@/lib/bossFight/drawing/drawBackground'
import { drawCat } from '@/lib/bossFight/drawing/drawCat'
import { drawBug } from '@/lib/bossFight/drawing/drawBug'
import { drawParticles, drawTokens, getShakeOffset } from '@/lib/bossFight/drawing/drawEffects'

// ─── Initial state ──────────────────────────────────────────────────────────

export function createInitialState(): GameState {
  return {
    mode:        'playing',
    wave:        1,
    waveTimer:   WAVE_1_DURATION,
    score:       0,
    cat:         makeCat(),
    bugs:        [],
    tokens:      [],
    particles:   [],
    spawnTimer:  spawnInterval(1),
    tokenTimer:  randomTokenInterval(),
    shake:       0,
    worldX:      0,
    nextId:      1,
  }
}

function spawnInterval(wave: 1 | 2): number {
  return Math.max(SPAWN_BASE - wave * SPAWN_WAVE_DEC, SPAWN_MIN)
}

function randomTokenInterval(): number {
  return TOKEN_SPAWN_MIN + Math.floor(Math.random() * (TOKEN_SPAWN_MAX - TOKEN_SPAWN_MIN + 1))
}

// ─── Update ─────────────────────────────────────────────────────────────────

export function update(state: GameState, keys: Set<string>, dt: number): void {
  if (state.mode === 'gameover') return
  if (state.mode === 'wave3hold') {
    // Still tick particles and scroll so the scene doesn't freeze
    tickParticles(state, dt)
    state.worldX += BG_SCROLL_SPEED * dt
    state.shake   = Math.max(0, state.shake - SHAKE_DECAY * dt)
    return
  }

  // ── Input: edge-triggered lane switches ──
  const wantUp   = keys.has('ArrowUp')   || keys.has('w') || keys.has('W')
  const wantDown = keys.has('ArrowDown') || keys.has('s') || keys.has('S')

  if (wantUp   && state.cat.lane > 0) state.cat.lane -= 1
  if (wantDown && state.cat.lane < 2) state.cat.lane += 1

  // ── Cat y interpolation ──
  const targetY = LANES[state.cat.lane]
  state.cat.y += (targetY - state.cat.y) * LANE_LERP * dt

  // ── Cat walk animation ──
  state.cat.animTick += dt
  if (state.cat.animTick >= ANIM_PERIOD) {
    state.cat.animTick = 0
    state.cat.animFrame = (state.cat.animFrame + 1) % 4
  }

  // ── I-frames countdown ──
  if (state.cat.iframes > 0) state.cat.iframes = Math.max(0, state.cat.iframes - dt)

  // ── Move bugs + wobble ──
  const bugSpeed = (b: typeof state.bugs[0]) =>
    b.type === 'fast' ? BUG_SPEED_FAST : BUG_SPEED_NORMAL
  for (const bug of state.bugs) {
    bug.x -= bugSpeed(bug) * dt
    bug.wobblePhase += BUG_WOBBLE_SPEED * dt
  }

  // ── Move tokens ──
  for (const tok of state.tokens) {
    tok.x -= TOKEN_SPEED * dt
  }

  // ── Collisions ──
  if (state.cat.iframes <= 0) {
    for (const bug of state.bugs) {
      if (catHitsBug(state.cat, bug)) {
        state.cat.hp      -= 1
        state.cat.iframes  = CAT_IFRAMES
        state.shake        = SHAKE_ON_HIT
        state.particles.push(...spawnHitParticles(state.cat.x + 28, state.cat.y, C.red))
        break
      }
    }
  }

  for (let i = state.tokens.length - 1; i >= 0; i--) {
    if (catHitsToken(state.cat, state.tokens[i])) {
      state.score += TOKEN_SCORE
      state.particles.push(...spawnHitParticles(state.tokens[i].x, state.tokens[i].y, C.amber))
      state.tokens.splice(i, 1)
    }
  }

  // ── Clean off-screen entities ──
  state.bugs   = state.bugs.filter(b => b.x > -40)
  state.tokens = state.tokens.filter(t => t.x > -20)

  // ── Bug spawning ──
  state.spawnTimer -= dt
  if (state.spawnTimer <= 0) {
    const pattern = pickPattern()
    for (const lane of pattern) {
      const isFast = state.wave === 2 && Math.random() < FAST_BUG_CHANCE_W2
      const type = isFast ? 'fast' : 'normal'
      state.bugs.push(makeBug(state.nextId++, lane, type, pickLabel()))
    }
    state.spawnTimer = spawnInterval(state.wave)
  }

  // ── Token spawning ──
  state.tokenTimer -= dt
  if (state.tokenTimer <= 0) {
    const safeLanes = ([0, 1, 2] as const).filter(l => isSafeLane(l, state.bugs))
    if (safeLanes.length > 0) {
      const lane = safeLanes[Math.floor(Math.random() * safeLanes.length)]
      state.tokens.push(makeToken(state.nextId++, lane))
    }
    state.tokenTimer = randomTokenInterval()
  }

  // ── Particles ──
  tickParticles(state, dt)

  // ── Game over check ──
  if (state.cat.hp <= 0) {
    state.cat.hp = 0
    state.mode   = 'gameover'
    return
  }

  // ── Wave timer ──
  state.waveTimer -= dt
  if (state.waveTimer <= 0) {
    if (state.wave === 1) {
      state.wave       = 2
      state.waveTimer  = WAVE_2_DURATION
      state.bugs       = []
      state.tokens     = []
      state.spawnTimer = spawnInterval(2)
    } else {
      // Wave 2 done — hold for Phase 3 (powerup)
      state.mode   = 'wave3hold'
      state.bugs   = []
      state.tokens = []
    }
  }

  // ── Scroll + shake ──
  state.worldX += BG_SCROLL_SPEED * dt
  state.shake   = Math.max(0, state.shake - SHAKE_DECAY * dt)
}

function tickParticles(state: GameState, dt: number): void {
  for (const p of state.particles) {
    p.x    += p.vx * dt
    p.y    += p.vy * dt
    p.vy   += 0.15 * dt   // gravity
    p.life -= dt
  }
  state.particles = state.particles.filter(p => p.life > 0)
}

function isSafeLane(lane: number, bugs: GameState['bugs']): boolean {
  return !bugs.some(b => b.lane === lane && b.x > TOKEN_SAFE_START && b.x < TOKEN_SAFE_END)
}

// ─── Draw ────────────────────────────────────────────────────────────────────

export function draw(ctx: CanvasRenderingContext2D, state: GameState): void {
  const { dx, dy } = getShakeOffset(state.shake)

  // Scene (with shake)
  if (dx !== 0 || dy !== 0) ctx.save()
  if (dx !== 0 || dy !== 0) ctx.translate(dx, dy)

  drawBackground(ctx, state.worldX)
  drawTokens(ctx, state.tokens)
  for (const bug of state.bugs) drawBug(ctx, bug)
  drawCat(ctx, state.cat)
  drawParticles(ctx, state.particles)

  if (dx !== 0 || dy !== 0) ctx.restore()

  // HUD (always in screen space, no shake)
  drawHUD(ctx, state)

  // Overlay screens
  if (state.mode === 'gameover')   drawGameOver(ctx, state.score)
  if (state.mode === 'wave3hold')  drawWave3Hold(ctx)
}

// ─── HUD ─────────────────────────────────────────────────────────────────────

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState): void {
  // HP hearts (top-left)
  ctx.font = '14px monospace'
  ctx.textBaseline = 'top'
  for (let i = 0; i < CAT_HP; i++) {
    ctx.fillStyle = i < state.cat.hp ? C.red : '#3a1020'
    ctx.fillText('♥', 10 + i * 20, 8)
  }

  // Wave (top-center)
  const waveLabel = state.mode === 'wave3hold'
    ? 'WAVE 3'
    : `WAVE ${state.wave}`
  ctx.fillStyle = C.cyanDim
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(waveLabel, CW / 2, 10)
  ctx.textAlign = 'left'

  // Score (top-right)
  ctx.fillStyle = C.amber
  ctx.font = '11px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(String(state.score).padStart(6, '0'), CW - 10, 8)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

// ─── Overlay screens ─────────────────────────────────────────────────────────

function drawGameOver(ctx: CanvasRenderingContext2D, score: number): void {
  // Dark overlay
  ctx.fillStyle = 'rgba(7,7,17,0.78)'
  ctx.fillRect(0, 0, CW, CH)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = C.red
  ctx.font = 'bold 36px monospace'
  ctx.fillText('STACK OVERFLOW', CW / 2, CH / 2 - 30)

  ctx.fillStyle = C.white
  ctx.font = '14px monospace'
  ctx.fillText(`score: ${score}`, CW / 2, CH / 2 + 10)

  ctx.fillStyle = C.cyanDim
  ctx.font = '11px monospace'
  ctx.fillText('PRESS R TO RESTART   /   ESC TO EXIT', CW / 2, CH / 2 + 40)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

function drawWave3Hold(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(7,7,17,0.6)'
  ctx.fillRect(0, 0, CW, CH)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = C.green
  ctx.font = 'bold 22px monospace'
  ctx.fillText('POWERUP INCOMING', CW / 2, CH / 2 - 16)

  ctx.fillStyle = C.cyanDim
  ctx.font = '11px monospace'
  ctx.fillText('[ coming soon ]', CW / 2, CH / 2 + 16)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

// Needed for GameMode type guard
export type { GameMode }
