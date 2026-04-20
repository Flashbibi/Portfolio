---
title: Deep Dives
order: 3
---

## Delta-Time

The boss fight game loop runs on `requestAnimationFrame`. The naive approach — moving objects a fixed number of pixels per frame — breaks the moment frame rate fluctuates. At 120fps the cat moves twice as fast as at 60fps.

The fix: delta-time normalization. `dt = Math.min(elapsed, 50) / (1000/60)`. At 60fps, `dt ≈ 1.0`. At 30fps, `dt ≈ 2.0`, so objects travel further per frame to keep velocity constant. The 50ms cap prevents a spike on tab switch — without it, a single frame would send everything flying across the screen. The `visibilitychange` handler pauses the loop entirely when the tab is hidden and resets `lastTime` on return, so the cap is rarely needed in practice.

---

## CSS Custom Properties Mid-Animation

`GlitchText` runs through four phases: idle → corrupt → morph → settle. The glow effect in each phase varies by theme (dark/light) and glitch category. The naive approach: separate CSS classes per combination — 3 × 2 = 6 combinations, every animation rule multiplied by 6.

Instead, `GlitchText.tsx` sets `--gw` and `--gs` as inline CSS custom properties on the span. The CSS keyframes reference `var(--gw)` — for example in `gFadeOut`. CSS custom properties are resolved at computed-style time per frame, not at animation start. That means if `--gw` changes mid-animation (phase transition, theme switch), the animation reads the new value immediately. One keyframe set. No class combinations.

---

## Local LLMs — Why Not

The original plan was a local LLM (Ollama + Mistral) — no API key, no cost, full control. The problem: the portfolio runs on Vercel. Vercel serverless functions have a 50MB deployment limit, no persistent process, no running inference server. Even quantized models at 1–2GB don't fit. A separate VPS means permanent infrastructure to maintain.

The alternative: Anthropic Claude Haiku 4.5 via API. Haiku streams in ~300ms, is cheap enough for portfolio traffic, and needs only one environment variable. The streaming response flows directly through a Next.js API route — no buffering, no waiting for a full completion. Rate limiting: 20 messages per IP per hour, tracked via Upstash Redis (also serverless — no persistent state problem). The trade-off is deliberate: dependency for reliability.

---

## Shown vs. Found Achievements

The system has 18 achievements. Not all of them should be telegraphed upfront — `curious`, `dog-cat`, and `destroyer` only work as surprises. Two competing UX goals: gamification needs visibility (users who don't know achievements exist won't look for them), but full transparency makes discoveries mechanical.

The solution: progressive disclosure in two layers. **Default**: only unlocked achievements are visible. The panel is never empty — `first-boot` unlocks automatically on first visit. **Opt-in**: "show all" reveals locked entries by name, but descriptions stay hidden. That signals something exists without spoiling the how. **Session-scoped**: `sessionStorage` resets the reveal state per session — users who want the discovery experience fresh on their next visit get it.

---

## Background Iterations

Three iterations, none of them felt right.

**v1** — Canvas particles with connecting lines. Classic. Immediately generic.
**v2** — CSS noise overlay. Subtle, contributing nothing.
**v3** — Static line grid. Clean, but dead.

Each iteration added more than the last. None got closer to the goal.

The final version: two CSS pseudo-elements (a vertical rule and a rotated square) plus a `radial-gradient` spotlight that follows the cursor via `mousemove`. ~30 lines of CSS, one `useState`.

The effect came from doing less, not more.

---

## Auto-Playing Terminal

`TerminalIntro` plays a scripted boot sequence on first load: mount messages, `ls`, `cd`, language dialog, theme dialog, `./portfolio.sh`. About 8 seconds. Three technical challenges:

**Abort correctness**: The user can skip at any point. `skippedRef.current = true` is checked after every `await delay()` and every character typed in `typeCmd`. Without this, the async sequence keeps running in the background, appending DOM nodes to an already-unmounted div.

**Dialog interruption**: `waitForDialog` returns a promise that resolves on keypress or click. On skip, `cleanupChoice.current()` resolves the pending promise with its default value and removes all event listeners — no dangling handlers.

**State propagation without React context**: Language and theme are set via `localStorage` + DOM attributes + custom events (`portfolio:lang-set`, `portfolio:theme-change`). The rest of the app listens for these events. This decouples the intro sequence from the React state tree entirely.
