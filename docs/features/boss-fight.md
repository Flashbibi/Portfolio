# Cat Boss Fight — Feature Spec

## Overview

An easter-egg mini-game embedded in the portfolio. Triggered via the `fight` terminal command, it opens as a fake Windows-95-style application window over the portfolio. The player controls the portfolio's cat mascot, running through a cyberpunk circuit-board world, dodging bugs and collecting tokens. After two waves of dodge-only gameplay, a `console.log()` powerup appears that arms the cat. Then the Segfault boss arrives for a three-phase encounter.

The feature should feel like a complete small game, not a tech demo. Everything — from terminal boot sequence to victory screen — should be intentional.

## Scope for initial release

Included:
- Fake Windows-95 application window (draggable, close button)
- Terminal boot sequence before window opens
- Canvas-based game with 3-lane side-scrolling gameplay
- Cat player with walk-cycle animation
- Two dodge-only waves with bugs in patterns and collectible score tokens
- `console.log()` powerup before boss
- Segfault boss with 3 attack phases
- Projectile cancellation (cat bullets destroy boss bullets)
- Bug labels (flavor text like "off-by-one", "null ref")
- Achievements hooked into existing achievement system
- Redis-backed leaderboard (top 10)
- Desktop-only (mobile shows "desktop only" message)

Excluded for now (potential phase 2):
- Sound effects
- Multiple powerup types
- Second boss / new game plus
- Cat customization / hats
- Combo system

## Architecture

### File structure

```
components/
  bossFight/
    BossFightWindow.tsx        # Fake OS window chrome, close/drag
    BossFightGame.tsx          # Canvas game component
    BootSequence.tsx           # Terminal boot animation
    StartScreen.tsx            # Title screen with high score
    VictoryScreen.tsx          # End state, name entry for leaderboard
    GameOverScreen.tsx         # End state, retry prompt
    Leaderboard.tsx            # Top-10 display
    constants.ts               # Colors, speeds, balance values
    types.ts                   # TypeScript types for game entities

lib/
  bossFight/
    gameLoop.ts                # requestAnimationFrame loop, update/draw separation
    entities.ts                # Cat, Bug, Bullet, Token, Boss, Powerup factories
    collisions.ts              # AABB, lane-aware hit detection
    patterns.ts                # Bug spawn patterns, boss attack patterns
    bugLabels.ts               # Flavor label pool
    drawing/
      drawCat.ts
      drawBug.ts
      drawBoss.ts
      drawBackground.ts
      drawEffects.ts           # particles, screen shake
    leaderboardApi.ts          # Redis read/write wrapper

app/
  api/
    boss-fight/
      leaderboard/
        route.ts               # GET top 10, POST new score

data/
  bossFight/
    achievements.ts            # Achievement definitions, hooks into main system
```

### Integration points

- **Terminal**: Add `fight` command handler to existing terminal command registry. Not listed in `help` output (true easter egg). On execution: render boot sequence in terminal, then open BossFightWindow.
- **Achievement system**: Register new achievements via existing achievement registry. Check-and-unlock calls emit at appropriate game events.
- **Redis**: Reuse existing Redis connection (same as guestbook). Namespace keys under `boss-fight:leaderboard:*`.
- **Theme**: The window chrome respects dark/light theme. Game canvas interior stays dark cyberpunk regardless — it's a "CRT monitor inside the window".

## Game specification

### Coordinate system

- Canvas is 640x360 internal resolution, scaled up via CSS with `image-rendering: pixelated`.
- Lanes at y = 150, 215, 280 (center of cat sprite baseline).
- Ground line at y = 325.
- World coordinate system for background uses `WORLD_W = 1600` with modulo wrapping.
- All scroll calculations integer-snapped before draw to prevent subpixel jitter.

### Color palette (cyberpunk terminal)

```
bg:         #070711  (base)
bgDeep:     #0d0d1f  (horizon band, ground)
cyan:       #00d9ff  (lanes, UI accents)
cyanDim:    #0088aa  (secondary lines)
magenta:    #ff2975  (normal bugs)
magDim:     #9e1a49
green:      #00ff9f  (player bullets, powerup)
greenDim:   #008c56
amber:      #ffb547  (cat body, tokens)
red:        #ff3355  (fast bugs, boss, enemy bullets)
redDim:     #991b2e
white:      #e8e8ff  (text)
catFur:     #ffb547
catDark:    #c07818
catPink:    #ff6ba0  (cat ears, nose)
```

### Cat (player)

- Position: fixed at x=90, y switches between lane positions.
- Lane transition: interpolated with factor 0.3 per frame.
- Size: 36w x 28h (collision box).
- HP: 3.
- i-frames after hit: 80 frames (~1.3s), with blink animation every 6 frames.
- Armed state: boolean, set true on powerup pickup. Shows small green antenna when armed.
- Shoot cooldown: 14 frames. Only when armed. SPACE key.
- Run animation: 4 frames, cycles every 6 game frames. Leg positions defined per frame.

### Bugs (enemies)

- Two types: `normal` (magenta, speed 2.2) and `fast` (red, speed 3.6).
- Fast-bug spawn chance: 0% in wave 1, 30% in wave 2.
- Size: 22w x 20h.
- HP: 1.
- Vertical wobble: sin-wave ±3px for life.
- Spawn in predefined patterns (see `patterns.ts`).
- Each bug has a random label from bug label pool (flavor text, see below).
- Label renders small above bug in monospace font, semi-transparent.

### Bug labels (flavor pool)

```
"off-by-one"
"null ref"
"race condition"
"NaN"
"undefined"
"stack trace"
"deprecated"
"unreachable"
"memory leak"
"tech debt"
"typo"
"regression"
```

Assigned randomly on bug spawn, renders in white-ish with reduced opacity above the bug sprite, ~8px monospace. Labels do not affect gameplay.

### Spawn patterns

Pool of lane patterns for bug waves, chosen randomly:

```
[0], [1], [2], [0], [1], [2]   // singles (weighted 6x)
[0,1], [1,2], [0,2]             // doubles (one lane safe, 3x)
```

Spawn interval: `max(95 - wave * 8, 55)` frames.

### Tokens

- Spawn in "safe" lanes (no bug currently in range x > 380 and x < W+50).
- Speed: -3 per frame.
- Score: +5 on pickup.
- Spawn interval: 50-90 random frames.
- Visual: amber coin with "+" symbol, soft glow.

### Powerup (console.log)

- Spawns once at the start of wave 3.
- Speed: -2.2 per frame (slower than bugs so it's catchable).
- Homes gently toward player's current lane (retargets every 30 frames, interpolates y at 0.06).
- If missed (x < -30): respawns from the right. Player cannot fail to get it.
- On pickup: score +50, cat becomes armed, 60-frame delay before boss spawns (breathing room).
- Visual: green box with "log" text, pulsing glow.

### Boss (Segfault)

- Position: x=W-160, y=LANE[1]-20, bobs ±8px vertically.
- Size: 130w x 70h.
- HP: 30.
- Visual: red-bordered fake OS error window with "SEGFAULT.exe" title bar, angry eyes, toothy mouth. Dimensions and details in drawing spec.
- HP bar above boss, red on dimmer red background.

#### Phase transitions

- Phase 1: HP 100% → 66%
- Phase 2: HP 66% → 33%
- Phase 3: HP 33% → 0%

On phase transition: 15-frame white flash, phase label update in HUD.

#### Attack patterns

**Phase 1** (ranging shots):
- Fires one projectile at random lane.
- Projectile speed: 2.6.
- Cooldown: 70 frames.

**Phase 2** (lane denial, one safe):
- Picks a random "safe" lane.
- Fires projectiles in the other two lanes simultaneously.
- Projectile speed: 2.6.
- Cooldown: 110 frames.
- **Invariant: one lane is always safe.**

**Phase 3** (aimed + random):
- Fires one projectile at player's current lane (speed 3.0).
- Fires one projectile at a random other lane (speed 2.6).
- Cooldown: 85 frames.
- **Invariant: exactly one lane is always free.**

### Projectiles

- Player bullets: 14w x 6h, speed 9, color green.
- Boss bullets: 14w x 8h, speeds per phase above, color red.
- Player bullets cancel boss bullets on overlap (both removed, amber particle burst, +3 score).
- Player bullets damage bugs and boss (lane-aware for bugs, AABB for boss).

### Particles

- Simple rectangle particles, 3x3px.
- Gravity: +0.15 per frame.
- Lifetime: 20-30 frames.
- Colors context-dependent (amber on token, red on hit, green on victory, magenta on bug death).

### Screen shake

- Triggered on: player hit (10), boss hit on player (8), boss death (25).
- Random offset ±4px, decays 1/frame.

### Wave timing

- Wave 1: 540 frames (~9 seconds at 60fps).
- Wave 2: 600 frames (~10s).
- Wave 3: powerup phase, ends on pickup.
- Boss intro delay: 60 frames after pickup.
- Boss fight: until HP 0.

### Score values

- Token pickup: +5
- Powerup pickup: +50
- Normal bug kill (in boss fight): +10
- Boss hit: +5
- Boss bullet cancelled: +3
- Boss defeated: +500

## Controls

- `↑` / `W`: move lane up
- `↓` / `S`: move lane down
- `SPACE`: shoot (only when armed)
- `R`: restart after game over / victory
- `ESC`: close window (returns to portfolio)

Lane movement uses edge-triggered keys (one press = one lane switch, not hold-to-repeat).

## Window chrome

### Style: Windows 95

- Title bar: solid saturated blue (#0000aa), white Chicago-style font or close monospace alternative
- Title text: `bug-hunter.exe`
- Close button (X) on right of title bar, 16x16, gray with bevel borders
- Window body: light gray (#c0c0c0) with classic 2px inset/outset borders
- Canvas sits inside window body with a 2px inset border around it (looks like a sunken viewport)
- Below canvas: status bar with score / wave info (optional, can be inside canvas HUD)

### Behavior

- Opens with small scale-in animation (scale 0.9 → 1.0, opacity 0 → 1, 200ms).
- Draggable via title bar (anywhere in browser viewport, clamped so title bar stays visible).
- Close button (or ESC): scale-out animation, then unmount.
- Backdrop: semi-transparent dark overlay over portfolio (not blur — flat).
- Clicking backdrop does NOT close (prevent accidental close during play).
- Window is focused on open. Click-through not needed.

### Position

- First open: centered in viewport.
- Remember last drag position in session (not persisted across reloads).

## Terminal integration

### Command registration

Add `fight` to the terminal command registry. Not included in `help` output.

### Boot sequence

On `fight` command, print the following lines to the terminal with a 150-200ms delay between each:

```
> fight
initializing bug-hunter.exe...
[ok] loading cat sprites
[ok] loading segfault.dll
[ok] allocating heap
[ok] compiling shaders
[ok] ready
launching...
```

After the last line, wait 300ms, then open BossFightWindow.

### Close behavior

On window close, print to terminal:

```
> game closed. final score: {score}
```

If the player beat the boss, also print:
```
> achievement unlocked: exterminator
```
(Only if it was their first victory; check achievement state.)

## Achievements

Hook into existing achievement system. New achievements:

1. `bug-hunter`: Boss Fight started (trigger: window opens).
2. `exterminator`: Boss defeated (trigger: boss HP reaches 0).
3. `flawless-victory`: Boss defeated without losing any HP (trigger: victory + `state.cat.hp === 3`).
4. `token-collector`: Collect 50 tokens in a single run (trigger: cumulative token count per run reaches 50).
5. `reflexes`: Cancel 10 boss projectiles in a single run (trigger: cumulative cancel count per run reaches 10).

Each achievement should follow the existing shown/found pattern if relevant (some achievements are "done" when the trigger fires, no clicking required).

## Leaderboard

### Storage

Redis key: `boss-fight:leaderboard`
Structure: Sorted set (ZSET), score = game score, member = `${name}:${timestamp}` (timestamp to allow same names).

### API

`GET /api/boss-fight/leaderboard`
Returns top 10 entries: `[{ name, score, timestamp }]`, sorted desc.

`POST /api/boss-fight/leaderboard`
Body: `{ name: string, score: number }`
Validation:
- Name: 1-16 chars, trimmed, no control chars.
- Score: positive integer, max 99999 (sanity cap).
- Rate limit: 1 request per IP per 30 seconds.
- Return 201 with new rank, or 400 on invalid input.

### Frontend flow

- Start screen shows current top 5 (fetched on open).
- Victory screen: if score would enter top 10, show name input (default: empty, placeholder "your name"), submit button. After submit, show updated leaderboard with new entry highlighted.
- Name input max 16 chars, filter non-printable chars, default to "anonymous" if empty.

## Screens

### BootSequence

Rendered inside terminal, not the window. Typewriter effect, 150-200ms per line. Final line fades into window open.

### StartScreen

Rendered inside the window canvas.
- Large pixel-art title "BUG HUNTER"
- Subtitle: "a cat vs. segfault story"
- Top 5 leaderboard entries
- Controls reminder
- "PRESS SPACE TO START" blinking prompt
- "PRESS ESC TO EXIT"

### Game screen

As specified in game section.

### VictoryScreen

Rendered inside the window canvas (overlay on final game state).
- "BUG FIXED" in green, large
- Final score
- If new high score (top 10): name input + submit
- Updated leaderboard
- "PRESS SPACE TO PLAY AGAIN" / "PRESS ESC TO EXIT"

### GameOverScreen

- "STACK OVERFLOW" in red, large
- Final score
- "PRESS R TO RESTART" / "PRESS ESC TO EXIT"

## Mobile handling

If viewport width < 768px on window open:
- Do not open game window
- Print to terminal: `> bug-hunter.exe requires desktop. try again from a larger screen.`
- Return user to terminal state

## Performance targets

- 60 FPS on mid-range laptop.
- Canvas draw calls kept efficient (no allocations in loop).
- Entity arrays mutated in place, filtered with single pass.
- Background static where possible; only true scrolling elements move.

## Standing instructions for implementation

- Do NOT include "Co-Authored-By: Claude" or any similar attribution in commit messages.
- Do NOT include "🤖 Generated with Claude Code" or similar tags in commit messages.
- Commit messages should be clean, conventional, and attributed only to the human author.
- Ask before committing or pushing — let the human review first.
