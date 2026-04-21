# Brief — `/me` Manga-Seite

## TL;DR

Neue Route `/me` auf meinem Portfolio, persönlicher als die Main-Seite. Manga-Ästhetik: dichte Panel-Collage, Schwarz/Weiss mit Hover-Farbreveal, Halftone-Overlay, durchbrechende SFX und Sprechblasen. Desktop-first, 2-3 Viewport-Höhen lang.

## Konzept-Essenz

Die Main-Seite des Portfolios bleibt clean und HR-freundlich. `/me` ist das "zweite Kapitel" — wer tiefer gehen will, findet hier die Person hinter dem Code. Die Seite ist bewusst experimentell im Look, passt aber ins bestehende Design-System (Farben, Theme-Logik, Bilingualität).

Alle Bild-Panels sind default in Graustufen mit Manga-Screentone-Overlay (Halftone-Dots). Bei Hover werden sie farbig, das Halftone verschwindet, und ein SFX-Wort poppt auf. Das ist die Kern-Mechanik — Exploration wird belohnt, die Seite fühlt sich wie ein lebendiges Comic an.

## Warum zwei Prompts?

**Prompt 1 — Struktur** (Sonnet-tauglich, isoliert)
Route, Design-System-Erweiterung, wiederverwendbare Components, Scroll-Reveal-Hook, Platzhalter-Version der Seite. Nach diesem Prompt funktioniert die Seite, ist aber nicht "fertig".

**Prompt 2 — Inhalt** (Opus-geeignet, braucht Kontext-Integration)
Die echte Panel-Choreografie, alle Texte und Übersetzungen, Easter Eggs, Scroll-Reveal-Feintuning, Performance-Pass. Hier fliessen meine Platzhalter-Bilder und die finalen Strings rein.

## Was Claude Code selbst entscheidet

Die Prompts sind bewusst offen gehalten. Claude Code hat mehr Kontext über die Codebase als der Chat und darf entscheiden über:

- Konkrete Panel-Abmessungen und Anordnung
- Font-Loading-Strategie (next/font-Details)
- Mobile-Fallback-Ansatz
- Ob der Easter-Egg-Terminal-Command zusätzlich oder statt Nav-Link kommt
- Clip-Path-Geometrien
- Stagger-Timing des Scroll-Reveals
- Welche 1-2 Easter Eggs am besten passen

## Meine Workflow-Notizen

1. Zuerst Prompt 1 ausführen. Result lokal testen. Iterieren bis Struktur sitzt.
2. Parallel: ~20-25 Platzhalter-Bilder in `public/me/` ablegen (können grobe Stock-Fotos sein — finale Bilder kommen später).
3. Prompt 2 ausführen mit Verweis auf die Bilder.
4. Iterieren — Dichte anpassen, Easter Eggs finalisieren, Performance prüfen.
5. Später separat: Mobile-Pass, finale Bildauswahl, eventuell weitere Easter Eggs.

## Rote Linien

- Keine Änderungen an der Main-Seite ausser der neuen Nav-Integration.
- Keine Kollisionen mit dem bestehenden Reality-Glitches-System (Manga-Titel mit Stroke-Effekt nicht glitchen).
- Kein Mobile-Over-Engineering jetzt — bewusst Desktop-first.
- Keine neuen heavy Dependencies.
