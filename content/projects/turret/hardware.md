---
title: Hardware
order: 2
---

# Hardware

## Servos — DS3218MG

The DS3218MG was chosen for its torque-to-weight ratio. At 20 kg/cm it handles the camera module and housing without any flex under load. Metal gears mean no stripped teeth after repeated stress testing.

| Spec | Value |
|------|-------|
| Torque | 20 kg/cm |
| Speed | 0.16 sec/60° |
| Gears | Metal |
| Protocol | PWM |

## Housing — ePETG-CF

Carbon fiber reinforced PETG. Stiffer than regular PETG, lighter than PLA+, and handles the heat from the electronics better than standard PLA.

## ESP32

Controls both servos via PWM. Also handles Wi-Fi for remote control — a simple web interface lets me control pan/tilt from the browser.

## 3D Printing

Printed on a standard FDM printer. Tolerances are tuned to allow the servos to click in without screws on most joints, with screw holes as secondary fastening.
