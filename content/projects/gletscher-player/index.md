---
title: Overview
order: 1
---

# Gletscher Video Player

A custom Python-based interactive video system built for a glacier exhibition in Zürich. Runs on a Raspberry Pi and handles seamless looping video with interactive transitions.

## Context

The exhibition needed a kiosk-style video player that could switch between clips without any visible cuts or loading gaps. Off-the-shelf solutions didn't cut it.

## How it works

`mpv` handles video playback. Python communicates with it via an IPC socket, sending commands to preload the next clip before the current one ends. The transition is frame-accurate.

## Tech

- **Python** — control logic
- **mpv** — video engine via IPC socket
- **Raspberry Pi** — exhibition hardware

## Status

Done — deployed and running in the exhibition.
