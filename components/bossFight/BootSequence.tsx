type PrintFn = (text: string, cls?: string) => void

const BOOT_LINES = [
  'initializing bug-hunter.exe...',
  '[ok] loading cat sprites',
  '[ok] loading segfault.dll',
  '[ok] allocating heap',
  '[ok] compiling shaders',
  '[ok] ready',
  'launching...',
]

export function runBootSequence(print: PrintFn, onComplete: () => void): void {
  let elapsed = 0
  BOOT_LINES.forEach((line, i) => {
    elapsed += 150 + Math.floor(Math.random() * 51)
    const t = elapsed
    setTimeout(() => {
      print(line, 'muted')
      if (i === BOOT_LINES.length - 1) {
        setTimeout(onComplete, 300)
      }
    }, t)
  })
}
