---
title: Visualization
order: 2
---

# Visualization Approach

The core challenge was rendering large CSV datasets smoothly while keeping the UI responsive.

## D3.js Integration

D3 handles all the SVG rendering. React manages state and triggers re-renders — D3 never touches the DOM directly through React's tree, which avoids conflicts between the two libraries.

## Chart Types

- **Line charts** for mass balance over time per glacier
- **Bar charts** for year-over-year comparison
- **Overview map** showing all measured glaciers by region

## Animations

Transitions are handled with D3's built-in easing functions. On data update, bars and lines interpolate smoothly rather than jumping.
