import type { Lang } from '@/context/LanguageContext'

export type ProjectStatus = 'done' | 'wip' | 'planned'
export type ProjectCategory = 'software' | 'hardware'

export interface Project {
  id: string
  num: string
  title: string
  titleLine2?: { en: string; de: string }
  description: { en: string; de: string }
  tags: { en: string[]; de: string[] }
  status: ProjectStatus
  category: ProjectCategory
  origin: 'eth' | 'home'
  details: { en: string[]; de: string[] }
}

export const projects: Project[] = [
  {
    id: 'glamos',
    num: '001',
    title: 'GLAMOS',
    titleLine2: { en: 'Data Visualization', de: 'Datenvisualisierung' },
    description: {
      en: 'Interactive React app for visualizing Swiss glacier mass balance data. Responsive design, CSV processing, animated charts.',
      de: 'Interaktive React-App zur Visualisierung von Schweizer Gletschermassenbilanz-Daten. Responsive Design, CSV-Verarbeitung, animierte Charts.',
    },
    tags: { en: ['React', 'D3.js', 'CSV'], de: ['React', 'D3.js', 'CSV'] },
    status: 'done',
    category: 'software',
    origin: 'eth',
    details: {
      en: [
        'Real glacier data from GLAMOS initiative (ETH, University of Zurich)',
        'Interactive real-time analysis and trends since 1952',
        'CSV import for any mass balance dataset',
      ],
      de: [
        'Real Gletscherdaten von GLAMOS Initiative (ETH, Universität Zürich)',
        'Interaktive Echtzeit-Analysen und Trends seit 1952',
        'CSV-Import für beliebige Massenbilanz-Datasets',
      ],
    },
  },
  {
    id: 'fabricator',
    num: '002',
    title: 'Fabricator',
    titleLine2: { en: 'Server Manager', de: 'Server Manager' },
    description: {
      en: 'Flask + Vue.js tool for managing Minecraft servers. Standalone Windows .exe via PyInstaller, system tray icon, backup management.',
      de: 'Flask + Vue.js Tool zur Verwaltung von Minecraft-Servern. Standalone Windows-Exe via PyInstaller, Systemtray-Icon, Backup-Management.',
    },
    tags: { en: ['Flask', 'Vue.js', 'PyInstaller'], de: ['Flask', 'Vue.js', 'PyInstaller'] },
    status: 'wip',
    category: 'software',
    origin: 'home',
    details: {
      en: [
        'Manage Minecraft servers on Windows',
        'Backup and restore functions with one-click interface',
        'System tray integration for background operation',
      ],
      de: [
        'Verwaltung von Minecraft-Servern auf Windows',
        'Backup- und Restore-Funktionen mit One-Click-Interface',
        'Systemtray-Integration für Background-Betrieb',
      ],
    },
  },
  {
    id: 'gletscher-player',
    num: '003',
    title: 'Gletscher',
    titleLine2: { en: 'Video Player', de: 'Video-Player' },
    description: {
      en: 'Python-based interactive video system for a glacier exhibition. mpv with IPC socket for seamless transitions on Raspberry Pi.',
      de: 'Python-basiertes interaktives Video-System für eine Gletscherausstellung. mpv mit IPC-Socket für nahtlose Übergänge auf Raspberry Pi.',
    },
    tags: { en: ['Python', 'Raspberry Pi', 'mpv'], de: ['Python', 'Raspberry Pi', 'mpv'] },
    status: 'done',
    category: 'software',
    origin: 'home',
    details: {
      en: [
        'Custom-built for the glacier exhibition in Zurich',
        'Seamless video transitions via mpv IPC socket',
        'Tested and optimized on Raspberry Pi',
      ],
      de: [
        'Maßgeschneidert für die Gletscher-Ausstellung in Zürich',
        'Nahtlose Übergänge zwischen Videos via mpv IPC-Socket',
        'Auf Raspberry Pi getestet und optimiert',
      ],
    },
  },
  {
    id: 'turret',
    num: '004',
    title: 'Pan-Tilt',
    titleLine2: { en: 'Turret', de: 'Turret' },
    description: {
      en: 'Automatic turret (v8) with DS3218MG servos, ePETG-CF housing, and Blender 3D modeling for the 3D assembly.',
      de: 'Automatisches Geschütz (v8) mit DS3218MG-Servos, ePETG-CF-Gehäuse und Blender 3D Modeling für die 3D-Assembly.',
    },
    tags: { en: ['Blender', 'ESP32', '3D-Print'], de: ['Blender', 'ESP32', '3D-Druck'] },
    status: 'wip',
    category: 'hardware',
    origin: 'home',
    details: {
      en: [
        'Version 8: redesigned servo mount for higher precision',
        '3D model created with Blender 3D Modeling',
        'ePETG-CF housing for rigidity and weight optimization',
      ],
      de: [
        'Version 8: neu gestaltete Servo-Halterung für höhere Präzision',
        '3D-Modell per Blender 3D Modeling',
        'ePETG-CF Gehäuse für Steifigkeit und Gewicht-Optimierung',
      ],
    },
  },
  {
    id: 'next',
    num: '005',
    title: 'Next',
    titleLine2: { en: 'Project', de: 'Projekt' },
    description: {
      en: 'More coming soon.',
      de: 'Mehr kommt bald.',
    },
    tags: { en: [], de: [] },
    status: 'planned',
    category: 'hardware',
    origin: 'home',
    details: { en: [], de: [] },
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
        'about.md':        { type: 'file' },
        'achievements.md': { type: 'file' },
        'contact.md':      { type: 'file' },
        'guestbook.md':    { type: 'file' },
        'portfolio.sh':    { type: 'file', exec: true },
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
            'gletscher-player': {
              type: 'dir',
              children: { 'README.md': { type: 'file' } },
            },
            turret: {
              type: 'dir',
              children: {
                'README.md':   { type: 'file' },
                'v8_notes.md': { type: 'file' },
              },
            },
          },
        },
      },
    },
  },
}

type FileLines = Array<[string, string]>

export const fileContents: Record<string, { en: FileLines; de: FileLines }> = {
  'about.md': {
    en: [
      ['# about.md', 'amber'],
      ['', ''],
      ['name:      Linus', 'white'],
      ['location:  Zürich, Switzerland', 'white'],
      ['role:      CS Apprentice (App Dev) / Trainee at ETH Zürich', 'white'],
      ['', ''],
      ['bio: |', 'muted'],
      ['  I build things — from code, filament, and curiosity.', 'white'],
      ['  From Python scripts to 3D-printed enclosures.', 'white'],
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
    de: [
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
  },
  'contact.md': {
    en: [
      ['# contact.md', 'amber'],
      ['', ''],
      ['email:    linus@sommermeyer.ch', 'white'],
      ['github:   github.com/Flashbibi', 'blue'],
      ['linkedin: linkedin.com/in/lsommermeyer', 'blue'],
      ['location: Zürich, Switzerland', 'muted'],
      ['', ''],
      ['available for:', 'muted'],
      ['  - Internships & working student positions', 'white'],
      ['  - Open source collaborations', 'white'],
      ['  - Interesting projects', 'white'],
    ],
    de: [
      ['# contact.md', 'amber'],
      ['', ''],
      ['email:    linus@sommermeyer.ch', 'white'],
      ['github:   github.com/Flashbibi', 'blue'],
      ['linkedin: linkedin.com/in/lsommermeyer', 'blue'],
      ['ort:      Zürich, Schweiz', 'muted'],
      ['', ''],
      ['verfügbar für:', 'muted'],
      ['  - Praktika & Werkstudent', 'white'],
      ['  - Open Source Kooperationen', 'white'],
      ['  - Interessante Projekte', 'white'],
    ],
  },
  'portfolio.sh': {
    en: [
      ['#!/bin/bash', 'dim'],
      ['# Portfolio launcher — linus 2025', 'dim'],
      ['', ''],
      ['echo "Loading portfolio..."', 'muted'],
      ['open ./index.html', 'green'],
    ],
    de: [
      ['#!/bin/bash', 'dim'],
      ['# Portfolio launcher — linus 2025', 'dim'],
      ['', ''],
      ['echo "Loading portfolio..."', 'muted'],
      ['open ./index.html', 'green'],
    ],
  },
  'README.md (GLAMOS)': {
    en: [
      ['# GLAMOS Data Visualization', 'amber'],
      ['', ''],
      ['stack:   React, D3.js, CSV-Parser', 'white'],
      ['status:  ✓ Done', 'green'],
      ['', ''],
      ['Interactive visualization of Swiss', 'white'],
      ['glacier mass balance data (GLAMOS).', 'white'],
      ['Responsive, animated charts.', 'white'],
    ],
    de: [
      ['# GLAMOS Datenvisualisierung', 'amber'],
      ['', ''],
      ['stack:   React, D3.js, CSV-Parser', 'white'],
      ['status:  ✓ Fertig', 'green'],
      ['', ''],
      ['Interaktive Visualisierung der Schweizer', 'white'],
      ['Gletschermassenbilanz-Daten (GLAMOS).', 'white'],
      ['Responsive, animierte Charts.', 'white'],
    ],
  },
  'README.md (fabricator)': {
    en: [
      ['# Fabricator — Minecraft Server Manager', 'amber'],
      ['', ''],
      ['stack:   Flask, Vue.js, PyInstaller', 'white'],
      ['status:  ⧖ In Progress', 'amber'],
      ['', ''],
      ['GUI tool for managing Minecraft servers.', 'white'],
      ['Windows .exe, system tray, backup system.', 'white'],
    ],
    de: [
      ['# Fabricator — Minecraft Server Manager', 'amber'],
      ['', ''],
      ['stack:   Flask, Vue.js, PyInstaller', 'white'],
      ['status:  ⧖ In Arbeit', 'amber'],
      ['', ''],
      ['GUI-Tool zur Verwaltung von Minecraft-Servern.', 'white'],
      ['Windows .exe, Systemtray, Backup-System.', 'white'],
    ],
  },
  'README.md (gletscher-player)': {
    en: [
      ['# Gletscher Video Player', 'amber'],
      ['', ''],
      ['stack:   Python, mpv, IPC Socket', 'white'],
      ['status:  ✓ Done', 'green'],
      ['', ''],
      ['Interactive video system for the', 'white'],
      ['glacier exhibition in Zurich.', 'white'],
      ['Seamless transitions on Raspberry Pi.', 'white'],
    ],
    de: [
      ['# Gletscher Video Player', 'amber'],
      ['', ''],
      ['stack:   Python, mpv, IPC Socket', 'white'],
      ['status:  ✓ Fertig', 'green'],
      ['', ''],
      ['Interaktives Video-System für die', 'white'],
      ['Gletscher-Ausstellung in Zürich.', 'white'],
      ['Nahtlose Übergänge auf Raspberry Pi.', 'white'],
    ],
  },
  'README.md (turret)': {
    en: [
      ['# Pan-Tilt Turret', 'amber'],
      ['', ''],
      ['hardware: DS3218MG Servos, ESP32, ePETG-CF', 'white'],
      ['software: Blender 3D Modeling, MicroPython', 'white'],
      ['status:   ⧖ In Progress (v8)', 'amber'],
      ['', ''],
      ['Automatic pan-tilt turret with', 'white'],
      ['procedurally generated 3D model via Blender.', 'white'],
    ],
    de: [
      ['# Pan-Tilt Turret', 'amber'],
      ['', ''],
      ['hardware: DS3218MG Servos, ESP32, ePETG-CF', 'white'],
      ['software: Blender 3D Modeling, MicroPython', 'white'],
      ['status:   ⧖ In Arbeit (v8)', 'amber'],
      ['', ''],
      ['Automatisches Pan-Tilt-Geschütz mit', 'white'],
      ['prozedural generiertem 3D-Modell via Blender.', 'white'],
    ],
  },
  'secrets.md': {
    en: [
      ['# secrets.md', 'amber'],
      ['', ''],
      ['you found it. well done.', 'white'],
      ['', ''],
      ['only a few make it here.', 'muted'],
      ['', ''],
      ['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim'],
      ['', ''],
      ['  🐱  secret recording #001', 'green'],
      ['', ''],
      ['__VIDEO__:/secret.mp4', ''],
      ['', ''],
      ['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim'],
      ['', ''],
      ['  // not everything meows.', 'dim'],
      ['', ''],
    ],
    de: [
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
  },
  'v8_notes.md': {
    en: [
      ['# v8 Design Notes', 'amber'],
      ['', ''],
      ['- Complete redesign of servo mount', 'white'],
      ['- DS3218MG: 20kg/cm torque, metal gears', 'white'],
      ['- ePETG-CF for rigidity + weight savings', 'white'],
      ['- Blender 3D Modeling for assembly', 'white'],
      ['- Next steps: target detection via RPi Cam', 'muted'],
    ],
    de: [
      ['# v8 Design Notes', 'amber'],
      ['', ''],
      ['- Kompletter Redesign der Servo-Halterung', 'white'],
      ['- DS3218MG: 20kg/cm Torque, Metallgetriebe', 'white'],
      ['- ePETG-CF für Steifigkeit + Leichtigkeit', 'white'],
      ['- Blender 3D Modeling für Assembly', 'white'],
      ['- Nächste Schritte: Zielerkennung via RPi Cam', 'muted'],
    ],
  },
}

export function getFileContent(key: string, lang: Lang): Array<[string, string]> | undefined {
  const entry = fileContents[key]
  if (!entry) return undefined
  return entry[lang] ?? entry.en
}
