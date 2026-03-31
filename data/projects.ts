export type ProjectStatus = 'done' | 'wip' | 'planned'
export type ProjectCategory = 'software' | 'hardware'

export interface Project {
  id: string
  num: string
  title: string
  titleLine2?: string
  description: string
  tags: string[]
  status: ProjectStatus
  statusLabel: string
  category: ProjectCategory
  origin: 'eth' | 'home'
  details: string[]
}

export const projects: Project[] = [
  {
    id: 'glamos',
    num: '001',
    title: 'GLAMOS',
    titleLine2: 'Datenvisualisierung',
    description:
      'Interaktive React-App zur Visualisierung von Schweizer Gletschermassenbilanz-Daten. Responsive Design, CSV-Verarbeitung, animierte Charts.',
    tags: ['React', 'D3.js', 'CSV'],
    status: 'done',
    statusLabel: 'Fertig',
    category: 'software',
    origin: 'eth',
    details: [
      'Real Gletscherdaten von GLAMOS Initiative (ETH, Universität Zürich)',
      'Interaktive Echtzeit-Analysen und Trends seit 1952',
      'CSV-Import für beliebige Massenbilanz-Datasets',
    ],
  },
  {
    id: 'fabricator',
    num: '002',
    title: 'Fabricator',
    titleLine2: 'Server Manager',
    description:
      'Flask + Vue.js Tool zur Verwaltung von Minecraft-Servern. Standalone Windows-Exe via PyInstaller, Systemtray-Icon, Backup-Management.',
    tags: ['Flask', 'Vue.js', 'PyInstaller'],
    status: 'wip',
    statusLabel: 'In Arbeit',
    category: 'software',
    origin: 'home',
    details: [
      'Verwaltung von Minecraft-Servern auf Windows',
      'Backup- und Restore-Funktionen mit One-Click-Interface',
      'Systemtray-Integration für Background-Betrieb',
    ],
  },
  {
    id: 'gletscher-player',
    num: '003',
    title: 'Gletscher',
    titleLine2: 'Video-Player',
    description:
      'Python-basiertes interaktives Video-System für eine Gletscherausstellung. mpv mit IPC-Socket für nahtlose Übergänge auf Raspberry Pi.',
    tags: ['Python', 'Raspberry Pi', 'mpv'],
    status: 'done',
    statusLabel: 'Fertig',
    category: 'software',
    origin: 'home',
    details: [
      'Maßgeschneidert für die Gletscher-Ausstellung in Zürich',
      'Nahtlose Übergänge zwischen Videos via mpv IPC-Socket',
      'Auf Raspberry Pi getestet und optimiert',
    ],
  },
  {
    id: 'turret',
    num: '004',
    title: 'Pan-Tilt',
    titleLine2: 'Turret',
    description:
      'Automatisches Geschütz (v8) mit DS3218MG-Servos, ePETG-CF-Gehäuse und Blender 3D Modeling für die 3D-Assembly.',
    tags: ['Blender', 'ESP32', '3D-Druck'],
    status: 'wip',
    statusLabel: 'In Arbeit',
    category: 'hardware',
    origin: 'home',
    details: [
      'Version 8: neu gestaltete Servo-Halterung für höhere Präzision',
      '3D-Modell per Blender 3D Modeling',
      'ePETG-CF Gehäuse für Steifigkeit und Gewicht-Optimierung',
    ],
  },
  {
    id: 'next',
    num: '005',
    title: 'Nächstes',
    titleLine2: 'Projekt',
    description: 'Mehr kommt bald.',
    tags: [],
    status: 'planned',
    statusLabel: 'Geplant',
    category: 'hardware',
    origin: 'home',
    details: [],
  },
]

// ── Terminal filesystem ──────────────────────────────────────────────────────
export type FsNode =
  | { type: 'dir'; children: Record<string, FsNode>; dim?: boolean }
  | { type: 'file'; exec?: boolean }

export const filesystem: FsNode = {
  type: 'dir',
  children: {
    linus: {
      type: 'dir',
      children: {
        'about.md':     { type: 'file' },
        'contact.md':   { type: 'file' },
        'portfolio.sh': { type: 'file', exec: true },
        private: {
          type: 'dir',
          children: {
            'secrets.md': { type: 'file' },
          },
        },
        projects: {
          type: 'dir',
          children: {
            GLAMOS: {
              type: 'dir',
              children: { 'README.md': { type: 'file' } },
            },
            fabricator: {
              type: 'dir',
              children: { 'README.md': { type: 'file' } },
            },
            turret: {
              type: 'dir',
              children: {
                'README.md':    { type: 'file' },
                'v8_notes.md':  { type: 'file' },
              },
            },
          },
        },
      },
    },
  },
}

export const fileContents: Record<string, Array<[string, string]>> = {
  'about.md': [
    ['# about.md', 'amber'],
    ['', ''],
    ['name:      Linus', 'white'],
    ['location:  Zürich, Schweiz', 'white'],
    ['role:      Informatiker Applikationsentwickler / Lehrling ETH Zürich', 'white'],
    ['', ''],
    ['bio: |', 'muted'],
    ['  Ich baue Dinge — aus Code, Filament und Neugier.', 'white'],
    ['  Vom Python-Skript bis zum 3D-gedruckten Gehäuse.', 'white'],
    ['', ''],
    ['skills:', 'muted'],
    ['  - Python      ████████░░  85%', 'green'],
    ['  - Java        ████████░░  75%', 'green'],
    ['  - JavaScript  ███████░░░  75%', 'green'],
    ['  - SQL/MySQL   ███████░░░  80%', 'green'],
    ['  - REST APIs   ███████░░░  70%', 'green'],
    ['  - React/Vue   ███████░░░  68%', 'green'],
    ['  - Git/Docker  ██████░░░░  62%', 'green'],
    ['  - Linux/Bash  ██████░░░░  60%', 'green'],
    ['  - Blender 3D  ████░░░░░░  35%', 'green'],
    ['  - ESP32/RPi   ██████░░░░  58%', 'green'],
  ],
  'contact.md': [
    ['# contact.md', 'amber'],
    ['', ''],
    ['email:   linus.sommermeyer@lernende.ethz.ch', 'white'],
    ['github:  github.com/Flashbibi', 'blue'],
    ['linkedin: linkedin.com/in/linus-sommermeyer-a776142a2', 'blue'],
    ['ort:     Zürich, Schweiz', 'muted'],
    ['', ''],
    ['verfügbar für:', 'muted'],
    ['  - Praktika & Werkstudent', 'white'],
    ['  - Open Source Kooperationen', 'white'],
    ['  - Interessante Projekte', 'white'],
  ],
  'portfolio.sh': [
    ['#!/bin/bash', 'dim'],
    ['# Portfolio launcher — linus 2025', 'dim'],
    ['', ''],
    ['echo "Loading portfolio..."', 'muted'],
    ['open ./index.html', 'green'],
  ],
  'README.md (GLAMOS)': [
    ['# GLAMOS Datenvisualisierung', 'amber'],
    ['', ''],
    ['stack:   React, D3.js, CSV-Parser', 'white'],
    ['status:  ✓ Fertig', 'green'],
    ['', ''],
    ['Interaktive Visualisierung der Schweizer', 'white'],
    ['Gletschermassenbilanz-Daten (GLAMOS).', 'white'],
    ['Responsive, animierte Charts.', 'white'],
  ],
  'README.md (fabricator)': [
    ['# Fabricator — Minecraft Server Manager', 'amber'],
    ['', ''],
    ['stack:   Flask, Vue.js, PyInstaller', 'white'],
    ['status:  ⧖ In Arbeit', 'amber'],
    ['', ''],
    ['GUI-Tool zur Verwaltung von Minecraft-Servern.', 'white'],
    ['Windows .exe, Systemtray, Backup-System.', 'white'],
  ],
  'README.md (turret)': [
    ['# Pan-Tilt Turret', 'amber'],
    ['', ''],
    ['hardware: DS3218MG Servos, ESP32, ePETG-CF', 'white'],
    ['software: Blender 3D Modeling, MicroPython', 'white'],
    ['status:   ⧖ In Arbeit (v8)', 'amber'],
    ['', ''],
    ['Automatisches Pan-Tilt-Geschütz mit', 'white'],
    ['prozedural generiertem 3D-Modell via Blender.', 'white'],
  ],
  'secrets.md': [
    ['# secrets.md', 'amber'],
    ['', ''],
    ['du hast es gefunden. gut gemacht.', 'white'],
    ['', ''],
    ['nur wenige kommen hierher.', 'muted'],
    ['', ''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim'],
    ['', ''],
    ['  🐱  geheime aufzeichnung #001', 'green'],
    ['', ''],
    ['__VIDEO__:/secret.mp4', ''],
    ['', ''],
    ['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim'],
    ['', ''],
    ['  // nicht alles miaut.', 'dim'],
    ['', ''],
  ],
  'v8_notes.md': [
    ['# v8 Design Notes', 'amber'],
    ['', ''],
    ['- Kompletter Redesign der Servo-Halterung', 'white'],
    ['- DS3218MG: 20kg/cm Torque, Metallgetriebe', 'white'],
    ['- ePETG-CF für Steifigkeit + Leichtigkeit', 'white'],
    ['- Blender 3D Modeling für Assembly', 'white'],
    ['- Nächste Schritte: Zielerkennung via RPi Cam', 'muted'],
  ],
}
