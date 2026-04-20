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
    signMissing: string
    signSuccess: string
    signRateLimited: string
    signInappropriate: string
    signError: string
    whoError: string
    guestbookEmpty: string
    guestbookFooter: (count: number) => string
  }
  terminalIntro: {
    tagline: string
    dialogLabel: string
    langDialogLabel: string
    langSet: (lang: string) => string
    mounting: string
    loadingAssets: string
    starting: string
    ready: string
    envSet: (choice: string) => string
  }
  chat: {
    header:       string
    welcome:      string
    placeholder:  string
    error:        string
    rateLimited:  string
    clear:        string
    clearLabel:   string
    copied:       string
    open:         string
    close:        string
    suggestions:  string[]
  }
  footer: {

    location: string
  }
  projectDetail: {
    back: string
    detailsEmpty: string
    metaTitle: string
    achievements: {
      heading: string
      showAll: (n: number) => string
      hideLocked: string
      empty: string
    }
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
    helpHint: "  Type  help  for commands  ·  sign <message>  to leave a mark.",
    helpHeader: 'Available commands:',
    commands: [
      ['ls [dir]',        'List directory contents'],
      ['cd <dir>',        'Change directory  (cd .., cd ~)'],
      ['cat <file>',      'Read file'],
      ['tree',            'Show full structure'],
      ['pwd',             'Current path'],
      ['whoami',          'Who am I'],
      ['who',             'How many visitors are online right now'],
      ['sign <message>',  'Leave a message in the guestbook'],
      ['clear',           'Clear terminal'],
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
    signMissing:       'sign: missing message  (usage: sign <your message>)',
    signSuccess:       '  [  OK  ] Message saved to guestbook.',
    signRateLimited:   'sign: too many messages — try again in an hour.',
    signInappropriate: 'sign: message rejected — keep it clean.',
    signError:         'sign: failed to save — try again later.',
    whoError:        'who: failed to fetch visitor count.',
    guestbookEmpty:  '  (no entries yet — be the first! use: sign <message>)',
    guestbookFooter: (n) => `  ${n} ${n === 1 ? 'entry' : 'entries'}  ·  sign with: sign <message>`,
  },
  terminalIntro: {
    tagline:         'zürich, switzerland',
    dialogLabel:     'Choose your environment:',
    langDialogLabel: 'Choose your language:',
    langSet:         (l) => `  [  OK  ] Language set to: ${l}.`,
    mounting:        '  Mounting portfolio...',
    loadingAssets:'  Loading assets...',
    starting:     '  Starting...',
    ready:        '  [  OK  ] Portfolio ready. Opening...',
    envSet:       (choice) => `  [  OK  ] Environment set to: ${choice}.`,
  },
  footer: {
    location: 'Linus — Zürich, Switzerland',
  },
  chat: {
    header:      '[ miau — ask me anything ]',
    welcome:     "Meow! I'm Linus' assistant. What would you like to know?",
    placeholder: 'Ask me something...',
    error:       "Error — please try again.",
    rateLimited: "Too many requests — try again in an hour.",
    clear:       'clear',
    clearLabel:  'Clear chat',
    copied:      'copied!',
    open:        'Open chat',
    close:       'Close',
    suggestions: [
      "What are your skills?",
      "Tell me about your projects",
      "How can I contact you?",
      "How do I sign the guestbook?",
    ],
  },
  projectDetail: {
    back:         '← back',
    detailsEmpty: 'Details coming soon.',
    metaTitle:    'Project — Linus',
    achievements: {
      heading:    'Achievements',
      showAll:    (n) => `[ show all ${n} ]`,
      hideLocked: '[ hide locked ]',
      empty:      'No achievements unlocked yet.',
    },
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
    helpHint: '  Tippe  help  für Befehle  ·  sign <nachricht>  um eine Spur zu hinterlassen.',
    helpHeader: 'Verfügbare Befehle:',
    commands: [
      ['ls [dir]',        'Ordnerinhalt anzeigen'],
      ['cd <dir>',        'Verzeichnis wechseln  (cd .., cd ~)'],
      ['cat <file>',      'Datei lesen'],
      ['tree',            'Gesamte Struktur anzeigen'],
      ['pwd',             'Aktuellen Pfad'],
      ['whoami',          'Wer bin ich'],
      ['who',             'Wie viele Besucher sind gerade online'],
      ['sign <nachricht>', 'Nachricht im Guestbook hinterlassen'],
      ['clear',           'Terminal leeren'],
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
    signMissing:       'sign: fehlende Nachricht  (usage: sign <deine Nachricht>)',
    signSuccess:       '  [  OK  ] Nachricht im Guestbook gespeichert.',
    signRateLimited:   'sign: zu viele Nachrichten — versuch\'s in einer Stunde nochmal.',
    signInappropriate: 'sign: Nachricht abgelehnt — bleib sauber.',
    signError:         'sign: speichern fehlgeschlagen — versuch\'s später nochmal.',
    whoError:        'who: Besucherzahl konnte nicht abgerufen werden.',
    guestbookEmpty:  '  (noch keine Einträge — sei der Erste! Nutze: sign <nachricht>)',
    guestbookFooter: (n) => `  ${n} ${n === 1 ? 'Eintrag' : 'Einträge'}  ·  eintragen mit: sign <nachricht>`,
  },
  terminalIntro: {
    tagline:         'zürich, schweiz',
    dialogLabel:     'Wähle dein Environment:',
    langDialogLabel: 'Wähle deine Sprache:',
    langSet:         (l) => `  [  OK  ] Sprache gesetzt auf: ${l}.`,
    mounting:        '  Mounting portfolio...',
    loadingAssets:'  Loading assets...',
    starting:     '  Starting...',
    ready:        '  [  OK  ] Portfolio ready. Opening...',
    envSet:       (choice) => `  [  OK  ] Environment set to: ${choice}.`,
  },
  footer: {
    location: 'Linus — Zürich, Schweiz',
  },
  chat: {
    header:      '[ miau — frag mich was ]',
    welcome:     "Miau! Ich bin Linus' Assistent. Was möchtest du wissen?",
    placeholder: 'Frag mich was...',
    error:       "Fehler — versuch's nochmal.",
    rateLimited: "Zu viele Anfragen — versuch's in einer Stunde nochmal.",
    clear:       'leeren',
    clearLabel:  'Chat löschen',
    copied:      'kopiert!',
    open:        'Chat öffnen',
    close:       'Schliessen',
    suggestions: [
      "Was sind deine Fähigkeiten?",
      "Erzähl mir von deinen Projekten",
      "Wie kann ich dich kontaktieren?",
      "Wie trage ich mich ins Guestbook ein?",
    ],
  },
  projectDetail: {
    back:         '← zurück',
    detailsEmpty: 'Details folgen bald.',
    metaTitle:    'Projekt — Linus',
    achievements: {
      heading:    'Errungenschaften',
      showAll:    (n) => `[ alle ${n} anzeigen ]`,
      hideLocked: '[ gesperrte ausblenden ]',
      empty:      'Noch keine Errungenschaften freigeschaltet.',
    },
  },
}

export const translations: Record<Lang, Translations> = { en, de }
export type { Translations }
