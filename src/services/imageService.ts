export function getImageUrl(seed: string, width = 600, height = 400): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}

export function getSeedsForOptions(options: string[], sessionSeed: number): string[] {
  return options.map((label, i) => `${sessionSeed}-${label}-${i}`)
}