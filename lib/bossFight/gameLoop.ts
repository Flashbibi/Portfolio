import { GameState, GameMode, Boss, RunStats } from '@/components/bossFight/types'
import {
  LANES, LANE_LERP, ANIM_PERIOD,
  CAT_IFRAMES, CAT_W,
  SHAKE_ON_HIT, SHAKE_DECAY,
  BUG_SPEED_NORMAL, BUG_SPEED_FAST, BUG_WOBBLE_SPEED,
  TOKEN_SPEED, TOKEN_SCORE, TOKEN_SAFE_START, TOKEN_SAFE_END,
  TOKEN_SPAWN_MIN, TOKEN_SPAWN_MAX,
  SPAWN_BASE, SPAWN_MIN, SPAWN_WAVE_DEC, FAST_BUG_CHANCE_W2,
  WAVE_1_DURATION, WAVE_2_DURATION, WAVE_COOLDOWN_DURATION, WAVE_BANNER_DURATION,
  BG_SCROLL_SPEED, CW, CH, C,
  CAT_X, CAT_HP,
  POWERUP_SPEED, POWERUP_HOMING_FACTOR, POWERUP_RETARGET_INTERVAL,
  POWERUP_PICKUP_BOSS_DELAY, POWERUP_SCORE,
  PLAYER_BULLET_W, PLAYER_BULLET_SPEED, PLAYER_SHOOT_COOLDOWN,
  BOSS_W, BOSS_H,
  BOSS_BOB_AMPLITUDE, BOSS_BOB_SPEED,
  BOSS_PHASE_2_THRESHOLD, BOSS_PHASE_3_THRESHOLD, BOSS_PHASE_FLASH_DURATION,
  BOSS_BULLET_W, BOSS_BULLET_H,
  BOSS_PHASE_1_COOLDOWN, BOSS_PHASE_2_COOLDOWN, BOSS_PHASE_3_COOLDOWN,
  BOSS_DEFEAT_SHAKE, BOSS_HIT_SHAKE,
  BOSS_SCORE_HIT, BOSS_SCORE_CANCEL, BOSS_SCORE_DEFEAT,
} from '@/components/bossFight/constants'
import {
  makeCat, makeBug, makeToken, makePowerup, makeBoss,
  makePlayerBullet, makeBossBullet,
  spawnHitParticles, spawnBurstParticles,
} from '@/lib/bossFight/entities'
import {
  catHitsBug, catHitsToken, catHitsPowerup,
  playerBulletHitsBoss, playerBulletHitsBossBullet, catHitsBossBullet,
} from '@/lib/bossFight/collisions'
import { pickPattern, bossPhase1Shots, bossPhase2Shots, bossPhase3Shots } from '@/lib/bossFight/patterns'
import { pickLabel } from '@/lib/bossFight/bugLabels'
import { drawBackground }    from '@/lib/bossFight/drawing/drawBackground'
import { drawCat }           from '@/lib/bossFight/drawing/drawCat'
import { drawBug }           from '@/lib/bossFight/drawing/drawBug'
import { drawBoss }          from '@/lib/bossFight/drawing/drawBoss'
import { drawPowerup }       from '@/lib/bossFight/drawing/drawPowerup'
import { drawPlayerBullets, drawBossBullets } from '@/lib/bossFight/drawing/drawBullet'
import { drawParticles, drawTokens, getShakeOffset } from '@/lib/bossFight/drawing/drawEffects'

// ─── Initial state ──────────────────────────────────────────────────────────

function makeRunStats(): RunStats {
  return { tokensCollected: 0, projectilesCancelled: 0 }
}

export function createInitialState(): GameState {
  return {
    mode:          'playing',
    wave:          1,
    waveTimer:     WAVE_1_DURATION,
    waveSubState:  'active',
    cooldownTimer: 0,
    bannerTimer:   0,
    score:         0,
    cat:           makeCat(),
    bugs:          [],
    tokens:        [],
    particles:     [],
    spawnTimer:    spawnInterval(1),
    tokenTimer:    randomTokenInterval(),
    shake:         0,
    worldX:        0,
    nextId:        1,
    powerup:       null,
    boss:          null,
    playerBullets: [],
    bossBullets:   [],
    bossDelay:     -1,
    runStats:      makeRunStats(),
  }
}

function spawnInterval(wave: 1 | 2): number {
  return Math.max(SPAWN_BASE - wave * SPAWN_WAVE_DEC, SPAWN_MIN)
}

function randomTokenInterval(): number {
  return TOKEN_SPAWN_MIN + Math.floor(Math.random() * (TOKEN_SPAWN_MAX - TOKEN_SPAWN_MIN + 1))
}

// ─── Update ─────────────────────────────────────────────────────────────────

export function update(state: GameState, keys: Set<string>, dt: number, onAchievement?: (id: string) => void): void {
  if (state.mode === 'gameover' || state.mode === 'victory') return

  if (state.mode === 'powerup') { updatePowerupPhase(state, keys, dt); return }
  if (state.mode === 'boss')    { updateBossPhase(state, keys, dt, onAchievement); return }

  // ── Playing mode (waves 1 & 2) ──

  // Input: edge-triggered lane switches
  const wantUp   = keys.has('ArrowUp')   || keys.has('w') || keys.has('W')
  const wantDown = keys.has('ArrowDown') || keys.has('s') || keys.has('S')
  if (wantUp   && state.cat.lane > 0) state.cat.lane -= 1
  if (wantDown && state.cat.lane < 2) state.cat.lane += 1

  // Cat y interpolation
  const targetY = LANES[state.cat.lane]
  state.cat.y += (targetY - state.cat.y) * LANE_LERP * dt

  // Cat walk animation
  state.cat.animTick += dt
  if (state.cat.animTick >= ANIM_PERIOD) {
    state.cat.animTick = 0
    state.cat.animFrame = (state.cat.animFrame + 1) % 4
  }

  // I-frames countdown
  if (state.cat.iframes > 0) state.cat.iframes = Math.max(0, state.cat.iframes - dt)

  // Move bugs + wobble
  for (const bug of state.bugs) {
    bug.x -= (bug.type === 'fast' ? BUG_SPEED_FAST : BUG_SPEED_NORMAL) * dt
    bug.wobblePhase += BUG_WOBBLE_SPEED * dt
  }

  // Move tokens
  for (const tok of state.tokens) tok.x -= TOKEN_SPEED * dt

  // Bug collisions
  if (state.cat.iframes <= 0) {
    for (const bug of state.bugs) {
      if (catHitsBug(state.cat, bug)) {
        state.cat.hp      -= 1
        state.cat.iframes  = CAT_IFRAMES
        state.shake        = SHAKE_ON_HIT
        state.particles.push(...spawnHitParticles(state.cat.x + CAT_W / 2, state.cat.y, C.red))
        break
      }
    }
  }

  // Token collisions
  for (let i = state.tokens.length - 1; i >= 0; i--) {
    if (catHitsToken(state.cat, state.tokens[i])) {
      state.score += TOKEN_SCORE
      state.particles.push(...spawnHitParticles(state.tokens[i].x, state.tokens[i].y, C.amber))
      state.tokens.splice(i, 1)
      state.runStats.tokensCollected += 1
      if (state.runStats.tokensCollected === 50) onAchievement?.('token-collector')
    }
  }

  // Off-screen cleanup
  state.bugs   = state.bugs.filter(b => b.x > -40)
  state.tokens = state.tokens.filter(t => t.x > -20)

  // Bug + token spawning (only during active sub-state)
  if (state.waveSubState === 'active') {
    state.spawnTimer -= dt
    if (state.spawnTimer <= 0) {
      for (const lane of pickPattern()) {
        const isFast = state.wave === 2 && Math.random() < FAST_BUG_CHANCE_W2
        state.bugs.push(makeBug(state.nextId++, lane, isFast ? 'fast' : 'normal', pickLabel()))
      }
      state.spawnTimer = spawnInterval(state.wave)
    }

    state.tokenTimer -= dt
    if (state.tokenTimer <= 0) {
      const safeLanes = ([0, 1, 2] as const).filter(l => isSafeLane(l, state.bugs))
      if (safeLanes.length > 0) {
        state.tokens.push(makeToken(state.nextId++, safeLanes[Math.floor(Math.random() * safeLanes.length)]))
      }
      state.tokenTimer = randomTokenInterval()
    }
  }

  // Particles
  tickParticles(state, dt)

  // Game over check
  if (state.cat.hp <= 0) { state.cat.hp = 0; state.mode = 'gameover'; return }

  // Wave sub-state machine
  if (state.waveSubState === 'active') {
    state.waveTimer -= dt
    if (state.waveTimer <= 0) {
      state.waveSubState  = 'cooldown'
      state.cooldownTimer = WAVE_COOLDOWN_DURATION
    }
  } else if (state.waveSubState === 'cooldown') {
    state.cooldownTimer -= dt
    if (state.cooldownTimer <= 0) {
      state.waveSubState = 'banner'
      state.bannerTimer  = WAVE_BANNER_DURATION
    }
  } else if (state.waveSubState === 'banner') {
    state.bannerTimer -= dt
    if (state.bannerTimer <= 0) {
      if (state.wave === 1) {
        state.wave         = 2
        state.waveTimer    = WAVE_2_DURATION
        state.waveSubState = 'active'
        state.spawnTimer   = spawnInterval(2)
      } else {
        state.mode    = 'powerup'
        state.powerup = makePowerup()
      }
    }
  }

  // Scroll + shake
  state.worldX += BG_SCROLL_SPEED * dt
  state.shake   = Math.max(0, state.shake - SHAKE_DECAY * dt)
}

// ─── Powerup phase ──────────────────────────────────────────────────────────

function updatePowerupPhase(state: GameState, keys: Set<string>, dt: number): void {
  tickCatCommon(state, keys, dt)

  if (state.powerup) {
    const p = state.powerup
    p.x         -= POWERUP_SPEED * dt
    p.glowPhase += 0.1 * dt

    // Retarget homing lane
    p.retargetTimer -= dt
    if (p.retargetTimer <= 0) {
      p.targetLane    = state.cat.lane
      p.retargetTimer = POWERUP_RETARGET_INTERVAL
    }

    // Interpolate y toward target lane
    p.y += (LANES[p.targetLane] - p.y) * POWERUP_HOMING_FACTOR * dt

    // Respawn if off left edge — player cannot fail to collect
    if (p.x + 14 < 0) p.x = CW + 14

    // Pickup
    if (catHitsPowerup(state.cat, p)) {
      state.score      += POWERUP_SCORE
      state.cat.armed   = true
      state.bossDelay   = POWERUP_PICKUP_BOSS_DELAY
      state.particles.push(...spawnBurstParticles(p.x, p.y, C.green, 16))
      state.powerup = null
    }
  } else {
    // Powerup collected, count down before boss spawns
    if (state.bossDelay > 0) {
      state.bossDelay -= dt
      if (state.bossDelay <= 0) {
        state.bossDelay = -1
        state.mode      = 'boss'
        state.boss      = makeBoss()
      }
    }
  }
}

// ─── Boss phase ─────────────────────────────────────────────────────────────

function updateBossPhase(state: GameState, keys: Set<string>, dt: number, onAchievement?: (id: string) => void): void {
  tickCatCommon(state, keys, dt)

  const boss = state.boss!

  // Shoot cooldown
  if (state.cat.shootCooldown > 0) {
    state.cat.shootCooldown = Math.max(0, state.cat.shootCooldown - dt)
  }

  // Shooting (SPACE, continuous fire via heldRef in BossFightGame)
  if (state.cat.armed && state.cat.shootCooldown <= 0 && keys.has(' ')) {
    state.playerBullets.push(
      makePlayerBullet(
        state.nextId++,
        state.cat.x + CAT_W + PLAYER_BULLET_W / 2,
        state.cat.y,
        state.cat.lane,
      )
    )
    state.cat.shootCooldown = PLAYER_SHOOT_COOLDOWN
  }

  // Boss bob
  boss.bobPhase += BOSS_BOB_SPEED * dt
  boss.y = LANES[1] - 20 + Math.sin(boss.bobPhase) * BOSS_BOB_AMPLITUDE

  // Boss flash timer
  if (boss.flashTimer > 0) boss.flashTimer = Math.max(0, boss.flashTimer - dt)

  // Move player bullets (rightward)
  for (const b of state.playerBullets) b.x += PLAYER_BULLET_SPEED * dt

  // Move boss bullets (leftward)
  for (const b of state.bossBullets) b.x -= b.speed * dt

  // Off-screen cleanup
  state.playerBullets = state.playerBullets.filter(b => b.x - PLAYER_BULLET_W / 2 < CW)
  state.bossBullets   = state.bossBullets.filter(b => b.x + BOSS_BULLET_W / 2 > 0)

  // Boss shoots
  boss.shootTimer -= dt
  if (boss.shootTimer <= 0) {
    const shots = boss.phase === 1 ? bossPhase1Shots()
                : boss.phase === 2 ? bossPhase2Shots()
                :                    bossPhase3Shots(state.cat.lane)

    for (const s of shots) {
      state.bossBullets.push(makeBossBullet(state.nextId++, boss.x - BOSS_BULLET_W / 2, s.lane, s.speed))
    }
    boss.shootTimer = boss.phase === 1 ? BOSS_PHASE_1_COOLDOWN
                    : boss.phase === 2 ? BOSS_PHASE_2_COOLDOWN
                    :                    BOSS_PHASE_3_COOLDOWN
  }

  // Player bullets × boss bullets (cancel)
  outer: for (let pi = state.playerBullets.length - 1; pi >= 0; pi--) {
    const pb = state.playerBullets[pi]
    for (let bi = state.bossBullets.length - 1; bi >= 0; bi--) {
      if (playerBulletHitsBossBullet(pb, state.bossBullets[bi])) {
        state.score += BOSS_SCORE_CANCEL
        state.particles.push(...spawnHitParticles(pb.x, pb.y, C.amber))
        state.playerBullets.splice(pi, 1)
        state.bossBullets.splice(bi, 1)
        state.runStats.projectilesCancelled += 1
        if (state.runStats.projectilesCancelled === 10) onAchievement?.('reflexes')
        continue outer
      }
    }
  }

  // Player bullets × boss (damage)
  for (let pi = state.playerBullets.length - 1; pi >= 0; pi--) {
    const pb = state.playerBullets[pi]
    if (playerBulletHitsBoss(pb, boss)) {
      boss.hp -= 1
      state.score += BOSS_SCORE_HIT
      state.particles.push(...spawnHitParticles(pb.x, pb.y, C.amber))
      state.playerBullets.splice(pi, 1)

      // Phase transition
      const ratio = boss.hp / boss.maxHp
      if (boss.phase === 1 && ratio <= BOSS_PHASE_2_THRESHOLD) {
        boss.phase       = 2
        boss.flashTimer  = BOSS_PHASE_FLASH_DURATION
        boss.shootTimer  = BOSS_PHASE_2_COOLDOWN
        state.bossBullets = []
      } else if (boss.phase === 2 && ratio <= BOSS_PHASE_3_THRESHOLD) {
        boss.phase       = 3
        boss.flashTimer  = BOSS_PHASE_FLASH_DURATION
        boss.shootTimer  = BOSS_PHASE_3_COOLDOWN
        state.bossBullets = []
      }

      // Victory
      if (boss.hp <= 0) {
        boss.hp      = 0
        state.score += BOSS_SCORE_DEFEAT
        state.shake  = BOSS_DEFEAT_SHAKE
        state.particles.push(...spawnBurstParticles(boss.x + BOSS_W / 2, boss.y, C.green, 30))
        state.mode   = 'victory'
        onAchievement?.('exterminator')
        if (state.cat.hp === 3) onAchievement?.('flawless-victory')
        return
      }
    }
  }

  // Boss bullets × cat
  if (state.cat.iframes <= 0) {
    for (let bi = state.bossBullets.length - 1; bi >= 0; bi--) {
      if (catHitsBossBullet(state.cat, state.bossBullets[bi])) {
        state.cat.hp      -= 1
        state.cat.iframes  = CAT_IFRAMES
        state.shake        = BOSS_HIT_SHAKE
        state.particles.push(...spawnHitParticles(state.cat.x + CAT_W / 2, state.cat.y, C.red))
        state.bossBullets.splice(bi, 1)
        break
      }
    }
  }

  // Game over
  if (state.cat.hp <= 0) { state.cat.hp = 0; state.mode = 'gameover' }
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function tickCatCommon(state: GameState, keys: Set<string>, dt: number): void {
  // Lane input
  const wantUp   = keys.has('ArrowUp')   || keys.has('w') || keys.has('W')
  const wantDown = keys.has('ArrowDown') || keys.has('s') || keys.has('S')
  if (wantUp   && state.cat.lane > 0) state.cat.lane -= 1
  if (wantDown && state.cat.lane < 2) state.cat.lane += 1
  state.cat.y += (LANES[state.cat.lane] - state.cat.y) * LANE_LERP * dt

  // Animation
  state.cat.animTick += dt
  if (state.cat.animTick >= ANIM_PERIOD) {
    state.cat.animTick = 0
    state.cat.animFrame = (state.cat.animFrame + 1) % 4
  }

  // I-frames
  if (state.cat.iframes > 0) state.cat.iframes = Math.max(0, state.cat.iframes - dt)

  // Particles + scroll + shake
  tickParticles(state, dt)
  state.worldX += BG_SCROLL_SPEED * dt
  state.shake   = Math.max(0, state.shake - SHAKE_DECAY * dt)
}

function tickParticles(state: GameState, dt: number): void {
  for (const p of state.particles) {
    p.x    += p.vx * dt
    p.y    += p.vy * dt
    p.vy   += 0.15 * dt
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
  const shaking = dx !== 0 || dy !== 0

  if (shaking) { ctx.save(); ctx.translate(dx, dy) }

  drawBackground(ctx, state.worldX)
  if (state.mode === 'playing' && state.waveSubState === 'banner') {
    drawWaveBanner(ctx, state.wave, state.bannerTimer)
  }
  drawTokens(ctx, state.tokens)
  for (const bug of state.bugs) drawBug(ctx, bug)

  if (state.powerup) drawPowerup(ctx, state.powerup)
  if (state.playerBullets.length > 0) drawPlayerBullets(ctx, state.playerBullets)

  drawCat(ctx, state.cat)

  if (state.boss)                   drawBoss(ctx, state.boss)
  if (state.bossBullets.length > 0) drawBossBullets(ctx, state.bossBullets)

  drawParticles(ctx, state.particles)

  if (shaking) ctx.restore()

  drawHUD(ctx, state)

  if (state.mode === 'gameover') drawGameOver(ctx, state.score)
  if (state.mode === 'victory')  drawVictory(ctx, state.score)
}

// ─── HUD ─────────────────────────────────────────────────────────────────────

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.font = '14px monospace'
  ctx.textBaseline = 'top'
  for (let i = 0; i < CAT_HP; i++) {
    ctx.fillStyle = i < state.cat.hp ? C.red : '#3a1020'
    ctx.fillText('♥', 10 + i * 20, 8)
  }

  let centerLabel: string
  let labelColor: string
  if (state.mode === 'boss' && state.boss) {
    centerLabel = `BOSS: PHASE ${state.boss.phase}`
    labelColor  = C.red
  } else if (state.mode === 'powerup') {
    centerLabel = 'WAVE 3'
    labelColor  = C.cyanDim
  } else {
    centerLabel = `WAVE ${state.wave}`
    labelColor  = C.cyanDim
  }

  ctx.fillStyle = labelColor
  ctx.font = '10px monospace'
  ctx.textAlign = 'center'
  ctx.fillText(centerLabel, CW / 2, 10)
  ctx.textAlign = 'left'

  ctx.fillStyle = C.amber
  ctx.font = '11px monospace'
  ctx.textAlign = 'right'
  ctx.fillText(String(state.score).padStart(6, '0'), CW - 10, 8)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

// ─── Wave banner ─────────────────────────────────────────────────────────────

function drawWaveBanner(ctx: CanvasRenderingContext2D, wave: 1 | 2, bannerTimer: number): void {
  const progress = 1 - bannerTimer / WAVE_BANNER_DURATION
  const label = wave === 1 ? 'WAVE 2' : 'FINAL WAVE'
  let x: number
  if (progress < 0.4) {
    const t = progress / 0.4
    x = CW + 200 + (CW / 2 - CW - 200) * (t * t)
  } else if (progress < 0.6) {
    x = CW / 2
  } else {
    const t = (progress - 0.6) / 0.4
    x = CW / 2 + (-CW / 2 - 200) * (t * (2 - t))
  }
  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.font = 'bold 48px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#000000'
  ctx.fillText(label, x + 3, CH / 2 + 3)
  ctx.fillStyle = C.cyan
  ctx.fillText(label, x, CH / 2)
  ctx.restore()
}

// ─── Overlay screens ─────────────────────────────────────────────────────────

function drawGameOver(ctx: CanvasRenderingContext2D, score: number): void {
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

function drawVictory(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.fillStyle = 'rgba(7,7,17,0.78)'
  ctx.fillRect(0, 0, CW, CH)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = C.green
  ctx.font = 'bold 36px monospace'
  ctx.fillText('BUG FIXED', CW / 2, CH / 2 - 30)

  ctx.fillStyle = C.white
  ctx.font = '14px monospace'
  ctx.fillText(`score: ${score}`, CW / 2, CH / 2 + 10)

  ctx.fillStyle = C.cyanDim
  ctx.font = '11px monospace'
  ctx.fillText('PRESS R TO PLAY AGAIN   /   ESC TO EXIT', CW / 2, CH / 2 + 40)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

// Re-export for external use
export type { GameMode }
