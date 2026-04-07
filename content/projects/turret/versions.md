---
title: Version History
order: 3
---

# Version History

## v8 — Current

Complete redesign of the servo mount. Previous versions had flex in the pan axis under load. v8 uses a direct-drive mount with the servo embedded into the base plate rather than mounted externally.

**Changes:**
- New servo mount geometry (direct-drive)
- ePETG-CF replaces regular PETG
- Cleaner cable routing through the base

## v7

First version with DS3218MG servos. Previously used SG90s which didn't have enough torque for the camera module weight.

## v6 and earlier

Experimental versions — mostly testing different geometries for the tilt axis and experimenting with bearing placements.

## Planned — v9

Target detection via Raspberry Pi Camera + OpenCV. The ESP32 receives coordinates and adjusts pan/tilt accordingly.
