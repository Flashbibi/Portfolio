---
title: Deep Dives
order: 3
---

## Delta-Time

Der Boss-Fight-Game-Loop läuft auf `requestAnimationFrame`. Der naive Ansatz — Objekte pro Frame um feste Pixelwerte bewegen — bricht zusammen, sobald die Framerate schwankt. Bei 120fps bewegt sich die Katze doppelt so schnell wie bei 60fps.

Die Lösung: Delta-Time-Normalisierung. `dt = Math.min(elapsed, 50) / (1000/60)`. Bei 60fps ist `dt ≈ 1.0`. Bei 30fps ist `dt ≈ 2.0`, sodass Objekte pro Frame weiter reisen und die Bewegungsgeschwindigkeit konstant bleibt. Der 50ms-Cap verhindert einen Spike nach Tab-Wechsel — ohne ihn würde ein einziger Frame alles quer über den Screen schicken. Der `visibilitychange`-Handler pausiert den Loop komplett bei verstecktem Tab und resettet `lastTime` bei Rückkehr, sodass der Cap kaum je benötigt wird.

---

## CSS Custom Properties Mid-Animation

`GlitchText` durchläuft vier Phasen: idle → corrupt → morph → settle. Der Glow-Effekt in jeder Phase variiert nach Theme (dark/light) und Glitch-Kategorie. Naiver Ansatz: separate CSS-Klassen für jede Kombination — 3 × 2 = 6 Kombinationen, jede Animations-Regel sechsfach.

Stattdessen setzt `GlitchText.tsx` `--gw` und `--gs` als Inline-CSS-Custom-Properties auf dem Span. Die CSS-Keyframes referenzieren `var(--gw)` — zum Beispiel in `gFadeOut`. CSS Custom Properties werden per Frame zur Computed-Style-Zeit aufgelöst, nicht beim Start der Animation. Das bedeutet: ändert sich `--gw` mitten in einer laufenden Animation (Phasenwechsel, Theme-Switch), liest die Animation sofort den neuen Wert. Ein Set Keyframes, null Klassen-Kombinationen.

---

## Lokale LLMs, warum nicht

Der ursprüngliche Plan war ein lokales LLM (Ollama + Mistral) — kein API-Key, keine Kosten, vollständige Kontrolle. Das Problem: das Portfolio läuft auf Vercel. Vercel Serverless Functions haben ein 50MB Deployment-Limit, kein persistenter Prozess, kein laufender Inference-Server. Selbst quantisierte Modelle bei 1–2GB funktionieren nicht. Eine eigene VPS bedeutet permanente Infrastruktur.

Die Alternative: Anthropic Claude Haiku 4.5 via API. Haiku streamt in ~300ms, ist günstig genug für Portfolio-Traffic, und braucht nur einen Env-Var. Die Streaming-Response wird direkt durch eine Next.js API-Route durchgeleitet — kein Buffering, kein komplettes Abwarten. Rate-Limiting: 20 Nachrichten pro IP/Stunde via Upstash Redis (auch serverless, kein Persistent-State-Problem). Der Trade-Off ist bewusst: Abhängigkeit gegen Zuverlässigkeit.

---

## Shown vs. Found Achievements

Das System hat 18 Achievements. Nicht alle sollten vorab sichtbar sein — `curious`, `dog-cat`, `destroyer` funktionieren nur als Überraschung. Zwei konkurrierende UX-Ziele: Gamification braucht Sichtbarkeit (Nutzer, die nicht wissen dass es Achievements gibt, werden keine suchen), aber vollständige Transparenz macht die Discoveries mechanisch.

Lösung: Progressive Disclosure in zwei Stufen. **Default**: nur freigeschaltete Achievements sichtbar. Kein leeres Panel — `first-boot` wird automatisch beim ersten Besuch entsperrt. **Opt-in**: "Show all" enthüllt gesperrte Achievements mit Name, aber die Descriptions bleiben verborgen. Das sagt "es gibt etwas" ohne das Wie zu spoilern. **Session-scoped**: `sessionStorage` resettet den Reveal-State pro Session — wer die Discovery-Erfahrung beim nächsten Besuch frisch haben will, bekommt sie.

---

## Background-Iterationen

Drei Iterationen, keine davon hat sich richtig angefühlt.

**v1** — Canvas-Partikel mit Verbindungslinien. Klassisch, sofort generisch.
**v2** — CSS-Noise-Overlay. Subtil, ohne Beitrag.
**v3** — Statisches Linienraster. Sauber, aber tot.

Jede Iteration hatte mehr Technik als die vorherige. Keine kam näher an das Ziel.

Die finale Lösung: zwei CSS-Pseudo-Elemente (vertikale Linie + rotiertes Quadrat) plus ein `radial-gradient`-Spotlight, das dem Cursor via `mousemove` folgt. ~30 Zeilen CSS, ein `useState`.

Der Effekt kam nicht durch mehr Technik, sondern durch weniger.

---

## Auto-Playing Terminal

`TerminalIntro` spielt beim ersten Laden eine geskriptete Boot-Sequenz ab: Mount-Messages, `ls`, `cd`, Language-Dialog, Theme-Dialog, `./portfolio.sh`. ~8 Sekunden. Drei technische Herausforderungen:

**Abort-Korrektheit**: Der User kann jederzeit skippen. `skippedRef.current = true` wird nach jedem `await delay()` und nach jedem getippten Zeichen in `typeCmd` gecheckt. Ohne das würde die async Sequenz im Hintergrund weiterlaufen und DOM-Nodes an einen bereits unmounted Div appenden.

**Dialog-Interruption**: `waitForDialog` returned ein Promise, das bei Tastendruck oder Klick resolved. Beim Skip ruft `cleanupChoice.current()` das Promise mit dem Default-Wert auf und entfernt alle Event-Listener — keine dangling Handlers.

**State-Propagation ohne React-Kontext**: Language und Theme werden via `localStorage` + DOM-Attribute + Custom Events (`portfolio:lang-set`, `portfolio:theme-change`) gesetzt. Der Rest der App lauscht auf diese Events. Das entkoppelt die Intro-Sequenz vollständig vom React-State-Baum.
