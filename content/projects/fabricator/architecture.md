---
title: Architecture
order: 2
---

# Architecture

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Flask (Python) |
| Frontend | Vue.js |
| Packaging | PyInstaller |
| Tray | pystray |

## How it works

Flask runs a local HTTP server on a fixed port. Vue.js communicates with it via REST calls. PyInstaller bundles everything — Python runtime, Flask, and the Vue build — into a single `.exe`.

The system tray icon is handled by `pystray`, which runs in a separate thread so the Flask server stays responsive.

## Packaging challenge

PyInstaller needs explicit hints for hidden imports and data files. The Vue build output is included as a static folder that Flask serves directly.
