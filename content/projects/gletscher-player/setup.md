---
title: Raspberry Pi Setup
order: 2
---

# Raspberry Pi Setup

## Hardware

- Raspberry Pi 4 (4GB)
- HDMI output to exhibition screen
- USB for input (if interactive)

## mpv IPC

mpv exposes a Unix socket when started with `--input-ipc-server`. Python sends JSON commands to it:

```python
import socket, json

sock = socket.socket(socket.AF_UNIX)
sock.connect('/tmp/mpvsocket')

def send(cmd):
    sock.send((json.dumps({"command": cmd}) + '\n').encode())

send(["loadfile", "next.mp4", "append-play"])
```

## Autostart

A systemd service starts the player on boot and restarts it if it crashes.

## Lessons learned

mpv's IPC is reliable but the timing of `loadfile` vs `observe_property` events needs care — sending the next file too early causes glitches, too late causes gaps.
