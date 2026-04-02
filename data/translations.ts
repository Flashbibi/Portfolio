import type { Lang } from '@/context/LanguageContext'

interface Translations {
  nav: {
    about: string
    projects: string
    contact: string
    terminal: string
    openTerminal: string
    lightTheme: string
    darkTheme: string
  }
  hero: {
    index: string
    lines: string[]
  }
  about: {
    label: string
    heading1: string
    heading2: string
    heading3: string
    bio1: string
    bio2: string
    skills: {
      strong: string
      good: string
      solid: string
      learning: string
    }
  }
  projects: {
    heading: string
    filters: {
      all: string
      eth: string
      home: string
      software: string
      hardware: string
    }
    status: {
      done: string
      wip: string
      planned: string
    }
  }
  contact: {
    label: string
    heading1: string
    heading2: string
    sub: string
    cv: string
  }
  terminal: {
    welcome: string
    helpHint: string
    helpHeader: string
    commands: Array<[string, string]>
    historyHint: string
    tabHint: string
    noPreview: string
    empty: string
    closeBtn: string
    headerHint: string
    catMissing: string
    dogMissing: string
    dogWrongDir: string
    commandNotFound: (verb: string) => string
  }
  terminalIntro: {
    tagline: string
    dialogLabel: string
    mounting: string
    loadingAssets: string
    starting: string
    ready: string
    envSet: (choice: string) => string
  }
  footer: {
    location: string
  }
  projectDetail: {
    back: string
    detailsEmpty: string
    metaTitle: string
  }
}

const en: Translations = {
  nav: {
    about: 'about me',
    projects: 'projects',
    contact: 'contact',
    terminal: 'terminal',
    openTerminal: 'Open Terminal',
    lightTheme: 'Enable light theme',
    darkTheme: 'Enable dark theme',
  },
  hero: {
    index: '01 — Welcome',
    lines: [
      'Developer & Maker from Switzerland.',
      'I build things — from code, filament, and curiosity.',
      'CS student. Hobbyist. Problem solver.',
    ],
  },
  about: {
    label: '02 — About me',
    heading1: 'Maker,',
    heading2: 'Developer',
    heading3: 'Tinkerer.',
    bio1: "I'm Linus, a computer science apprentice (application development) at ETH Zürich. I love projects where I can quickly go from an idea to a working prototype.",
    bio2: 'I mostly work on software projects around backend, APIs, databases, and modern web apps. In my spare time I also build small hardware and 3D-printed projects.',
    skills: {
      strong: 'Strong',
      good: 'Good',
      solid: 'Solid',
      learning: 'Learning',
    },
  },
  projects: {
    heading: 'Projects',
    filters: {
      all: 'All',
      eth: 'ETH Projects',
      home: 'Home Projects',
      software: 'Software',
      hardware: 'Hardware / 3D',
    },
    status: {
      done: 'Done',
      wip: 'In Progress',
      planned: 'Planned',
    },
  },
  contact: {
    label: '04 — Contact',
    heading1: "Let's",
    heading2: 'talk.',
    sub: "Whether it's a project, an idea, or just a friendly chat — I'm happy to hear from you. Reach me by email or on GitHub.",
    cv: 'Download CV',
  },
  terminal: {
    welcome: '  Welcome back. Explore the files.',
    helpHint: "  Type  help  for a list of commands.",
    helpHeader: 'Available commands:',
    commands: [
      ['ls [dir]',   'List directory contents'],
      ['cd <dir>',   'Change directory  (cd .., cd ~)'],
      ['cat <file>', 'Read file'],
      ['tree',       'Show full structure'],
      ['pwd',        'Current path'],
      ['whoami',     'Who am I'],
      ['clear',      'Clear terminal'],
    ],
    historyHint: '  ↑ / ↓   Browse command history',
    tabHint:     '  Tab     Autocomplete filenames',
    noPreview:   '(no preview)',
    empty:       '(empty)',
    closeBtn:    '[ close ]',
    headerHint:  "type 'help' for commands",
    catMissing:  'cat: missing filename',
    dogMissing:  'dog: missing filename',
    dogWrongDir: 'dog: unrecognized format  (wrong directory?)',
    commandNotFound: (verb) => `bash: ${verb}: command not found  (type 'help')`,
  },
  terminalIntro: {
    tagline:      'zürich, switzerland',
    dialogLabel:  'Choose your environment:',
    mounting:     '  Mounting portfolio...',
    loadingAssets:'  Loading assets...',
    starting:     '  Starting...',
    ready:        '  [  OK  ] Portfolio ready. Opening...',
    envSet:       (choice) => `  [  OK  ] Environment set to: ${choice}.`,
  },
  footer: {
    location: 'Linus — Zürich, Switzerland',
  },
  projectDetail: {
    back:         '← back',
    detailsEmpty: 'Details coming soon.',
    metaTitle:    'Project — Linus',
  },
}

const de: Translations = {
  nav: {
    about: 'über mich',
    projects: 'projekte',
    contact: 'kontakt',
    terminal: 'terminal',
    openTerminal: 'Terminal öffnen',
    lightTheme: 'Helles Theme aktivieren',
    darkTheme: 'Dunkles Theme aktivieren',
  },
  hero: {
    index: '01 — Willkommen',
    lines: [
      'Entwickler & Maker aus der Schweiz.',
      'Ich baue Dinge — aus Code, Filament und Neugier.',
      'Informatikstudent. Hobbybastler. Problemlöser.',
    ],
  },
  about: {
    label: '02 — Über mich',
    heading1: 'Maker,',
    heading2: 'Entwickler',
    heading3: 'Bastler.',
    bio1: 'Ich bin Linus, Informatiker Fachrichtung Applikationsentwicklung in Ausbildung an der ETH Zürich. Ich mag Projekte, bei denen ich schnell von einer Idee zu einem funktionierenden Prototyp komme.',
    bio2: 'Ich arbeite am liebsten an Softwareprojekten rund um Backend, APIs, Datenbanken und moderne Web-Apps. In meiner Freizeit baue ich zusätzlich kleine Hardware- und 3D-Projekte.',
    skills: {
      strong: 'Stark',
      good: 'Gut',
      solid: 'Solide',
      learning: 'Learning',
    },
  },
  projects: {
    heading: 'Projekte',
    filters: {
      all: 'Alle',
      eth: 'ETH Projekte',
      home: 'Home Projekte',
      software: 'Software',
      hardware: 'Hardware / 3D',
    },
    status: {
      done: 'Fertig',
      wip: 'In Arbeit',
      planned: 'Geplant',
    },
  },
  contact: {
    label: '04 — Kontakt',
    heading1: 'Lass uns',
    heading2: 'reden.',
    sub: 'Ob Projekt, Idee oder einfach ein nettes Gespräch — ich freue mich über Nachrichten. Erreichbar per Mail oder auf GitHub.',
    cv: 'CV herunterladen',
  },
  terminal: {
    welcome: '  Willkommen zurück. Erkunde die Dateien.',
    helpHint: '  Tippe  help  für eine Liste der Befehle.',
    helpHeader: 'Verfügbare Befehle:',
    commands: [
      ['ls [dir]',   'Ordnerinhalt anzeigen'],
      ['cd <dir>',   'Verzeichnis wechseln  (cd .., cd ~)'],
      ['cat <file>', 'Datei lesen'],
      ['tree',       'Gesamte Struktur anzeigen'],
      ['pwd',        'Aktuellen Pfad'],
      ['whoami',     'Wer bin ich'],
      ['clear',      'Terminal leeren'],
    ],
    historyHint: '  ↑ / ↓   Befehlsverlauf durchsuchen',
    tabHint:     '  Tab     Dateinamen vervollständigen',
    noPreview:   '(keine Vorschau)',
    empty:       '(leer)',
    closeBtn:    '[ schliessen ]',
    headerHint:  "tippe 'help' für Befehle",
    catMissing:  'cat: fehlender Dateiname',
    dogMissing:  'dog: fehlender Dateiname',
    dogWrongDir: 'dog: unrecognized format  (falscher Ordner?)',
    commandNotFound: (verb) => `bash: ${verb}: command not found  (tippe 'help')`,
  },
  terminalIntro: {
    tagline:      'zürich, schweiz',
    dialogLabel:  'Wähle dein Environment:',
    mounting:     '  Mounting portfolio...',
    loadingAssets:'  Loading assets...',
    starting:     '  Starting...',
    ready:        '  [  OK  ] Portfolio ready. Opening...',
    envSet:       (choice) => `  [  OK  ] Environment set to: ${choice}.`,
  },
  footer: {
    location: 'Linus — Zürich, Schweiz',
  },
  projectDetail: {
    back:         '← zurück',
    detailsEmpty: 'Details folgen bald.',
    metaTitle:    'Projekt — Linus',
  },
}

export const translations: Record<Lang, Translations> = { en, de }
export type { Translations }
