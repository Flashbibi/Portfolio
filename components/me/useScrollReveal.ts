'use client'

import { useEffect } from 'react'

const REVEALED = 'ink-revealed'

export function useScrollReveal(selector: string = '[data-ink-reveal]') {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!els.length) return

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add(REVEALED))
      return
    }

    /* Reveal order reads like a Western manga page: left→right, top→bottom
       (DOM order). Big bleeding SFX, speech bubbles and stickers are given
       higher data-ink-order so they land last in their batch — the inker's
       final flourish. Stagger is per-order (70ms), capped so a single
       intersection batch can't balloon past ~1.1s. */
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          if (target.classList.contains(REVEALED)) return
          const order = Number(target.dataset.inkOrder || 0)
          const delay = Math.min(order * 70, 1120)
          if (delay === 0) {
            target.classList.add(REVEALED)
          } else {
            window.setTimeout(() => target.classList.add(REVEALED), delay)
          }
          observer.unobserve(target)
        })
      },
      { threshold: 0.01, rootMargin: '0px 0px 80px 0px' }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}
