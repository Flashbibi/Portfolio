export interface Achievement {
  id:    string
  icon:  string
  title: string
  desc:  string
}

export const achievements: Achievement[] = [
  { id: 'first-boot',     icon: '🖥️', title: 'First Boot',       desc: 'Completed the boot sequence.'           },
  { id: 'terminal',       icon: '📟', title: 'Terminal Unlocked', desc: 'Opened the terminal drawer.'            },
  { id: 'curious',        icon: '🔍', title: 'Curious',           desc: 'Found the hidden secrets.'              },
  { id: 'dog-cat',        icon: '🐶', title: 'Dog > Cat',         desc: 'Used dog instead of cat. Respect.'      },
  { id: 'destroyer',      icon: '💥', title: 'System Destroyer',  desc: 'Nuked the portfolio. Bold move.'        },
  { id: 'left-a-mark',    icon: '✍️', title: 'Left a Mark',       desc: 'Signed the guestbook.'                  },
  { id: 'people-watcher', icon: '👀', title: 'People Watcher',    desc: 'Read the guestbook.'                    },
  { id: 'bilingual',      icon: '🌐', title: 'Bilingual',         desc: 'Switched the language.'                 },
  { id: 'cat-wrangler',   icon: '🐱', title: 'Cat Wrangler',      desc: 'Managed to grab the cat.'               },
  { id: 'cat-whisperer',  icon: '💬', title: 'Cat Whisperer',     desc: 'Had a chat with the mascot.'            },
  { id: 'explorer',       icon: '🗺️', title: 'Explorer',          desc: 'Visited every project page.'            },
  { id: 'tab-master',     icon: '⌨️', title: 'Tab Master',        desc: 'Used tab autocomplete in the terminal.' },
]

export const EXPLORER_PROJECTS = ['glamos', 'fabricator', 'gletscher-player', 'turret']
export const LS_VISITED        = 'portfolio:visited-projects'
