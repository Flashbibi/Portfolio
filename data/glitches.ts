export type GlitchCategory = 'miau' | 'insights' | 'absurd'

export interface GlitchEntry {
  original:    string
  replacement: string
  category:    GlitchCategory
}

export type GlitchDict = Record<'de' | 'en', GlitchEntry[]>

export const glitches: GlitchDict = {
  de: [
    // ── miau ────────────────────────────────────────────────────────────────
    { original: 'Projekte',        replacement: 'Miau Miau',               category: 'miau' },
    { original: 'Zürich',          replacement: 'Miauburg',                category: 'miau' },
    { original: 'Entwickler',      replacement: 'Miautwickler',            category: 'miau' },
    { original: 'Informatiker',    replacement: 'Inmiaumatiker',           category: 'miau' },
    { original: 'Code',            replacement: 'Miaude',                  category: 'miau' },
    { original: 'Schweiz',         replacement: 'Miauveterania',           category: 'miau' },
    { original: 'Daten',           replacement: 'Miaudaten',               category: 'miau' },
    { original: 'Terminal',        replacement: 'Miaurminal',              category: 'miau' },
    { original: 'Linux',           replacement: 'Linmiaoux',               category: 'miau' },
    { original: 'Server',          replacement: 'Miauserver',              category: 'miau' },
    { original: 'Netzwerk',        replacement: 'Miauzwerk',               category: 'miau' },
    { original: 'Skript',          replacement: 'Miaukript',               category: 'miau' },
    { original: 'Gehäuse',         replacement: 'Miauhäuse',               category: 'miau' },
    { original: 'Fehler',          replacement: 'Miaufehler',              category: 'miau' },
    { original: 'Visualisierung',  replacement: 'Miausualisierung',        category: 'miau' },
    // ── insights ────────────────────────────────────────────────────────────
    { original: 'Apprentice',      replacement: 'professioneller Googler', category: 'insights' },
    { original: 'Skills',          replacement: 'Baustellen',              category: 'insights' },
    { original: 'in Arbeit',       replacement: 'vorübergehend aufgegeben',category: 'insights' },
    { original: 'Lehrling',        replacement: 'Kaffeemaschinen-Experte', category: 'insights' },
    { original: 'Erfahrung',       replacement: 'Stunden auf YouTube',     category: 'insights' },
    { original: 'Dokumentation',   replacement: 'existiert theoretisch',   category: 'insights' },
    { original: 'Backup',          replacement: 'hätte ich machen sollen', category: 'insights' },
    { original: 'Version 8',       replacement: 'hoffentlich die letzte',  category: 'insights' },
    { original: 'optimiert',       replacement: 'zufällig funktioniert',   category: 'insights' },
    // ── absurd ──────────────────────────────────────────────────────────────
    { original: 'Python',          replacement: 'Schlangensprache',        category: 'absurd' },
    { original: 'ESP32',           replacement: 'teurer Lichtschalter',    category: 'absurd' },
    { original: 'Blender',         replacement: 'Würfelsimulator',         category: 'absurd' },
    { original: 'Raspberry Pi',    replacement: 'Pi-Himbeere',             category: 'absurd' },
    { original: 'Git',             replacement: 'Zeitmaschine für Fehler', category: 'absurd' },
    { original: 'Docker',          replacement: 'Schachtelcomputer',       category: 'absurd' },
    { original: 'Markdown',        replacement: 'vereinfachtes Chaos',     category: 'absurd' },
    { original: 'TypeScript',      replacement: 'JavaScript mit Schutzhelm', category: 'absurd' },
  ],
  en: [
    // ── miau ────────────────────────────────────────────────────────────────
    { original: 'projects',        replacement: 'Meow Meow',               category: 'miau' },
    { original: 'developer',       replacement: 'mewveloper',              category: 'miau' },
    { original: 'code',            replacement: 'mrrow',                   category: 'miau' },
    { original: 'Zurich',          replacement: 'Meowich',                 category: 'miau' },
    { original: 'Switzerland',     replacement: 'Meowzerland',             category: 'miau' },
    { original: 'data',            replacement: 'meow-ta',                 category: 'miau' },
    { original: 'terminal',        replacement: 'meowminal',               category: 'miau' },
    { original: 'Linux',           replacement: 'Linmeoux',                category: 'miau' },
    { original: 'server',          replacement: 'meow-server',             category: 'miau' },
    { original: 'network',         replacement: 'meow-work',               category: 'miau' },
    { original: 'script',          replacement: 'meow-script',             category: 'miau' },
    { original: 'errors',          replacement: 'oops-meows',              category: 'miau' },
    { original: 'visualization',   replacement: 'meowsualization',         category: 'miau' },
    { original: 'glacier',         replacement: 'meow-cier',               category: 'miau' },
    { original: 'housing',         replacement: 'meow-sing',               category: 'miau' },
    // ── insights ────────────────────────────────────────────────────────────
    { original: 'apprentice',      replacement: 'professional Googler',    category: 'insights' },
    { original: 'skills',          replacement: 'things I pretend to understand', category: 'insights' },
    { original: 'in progress',     replacement: 'temporarily abandoned',   category: 'insights' },
    { original: 'experience',      replacement: 'hours on YouTube',        category: 'insights' },
    { original: 'documentation',   replacement: 'theoretically exists',    category: 'insights' },
    { original: 'backup',          replacement: 'should have made one',    category: 'insights' },
    { original: 'optimized',       replacement: 'accidentally works',      category: 'insights' },
    { original: 'Version 8',       replacement: 'hopefully the last one',  category: 'insights' },
    { original: 'Internships',     replacement: 'unpaid overtime with wifi', category: 'insights' },
    // ── absurd ──────────────────────────────────────────────────────────────
    { original: 'Python',          replacement: 'snake language',          category: 'absurd' },
    { original: 'ESP32',           replacement: 'expensive light switch',  category: 'absurd' },
    { original: 'Blender',         replacement: 'cube simulator',          category: 'absurd' },
    { original: 'Raspberry Pi',    replacement: 'dessert computer',        category: 'absurd' },
    { original: 'Git',             replacement: 'time machine for mistakes', category: 'absurd' },
    { original: 'Docker',          replacement: 'box-in-a-box computer',   category: 'absurd' },
    { original: 'Markdown',        replacement: 'simplified chaos',        category: 'absurd' },
    { original: 'TypeScript',      replacement: 'JavaScript with a helmet', category: 'absurd' },
  ],
}
