export type SessionType = 'yesno' | 'headstails' | 'updown' | 'numbered' | 'labeled' | 'coordinate'

export type BinaryVariant = 'yesno' | 'headstails' | 'updown'

const binaryMeta: Record<BinaryVariant, { labels: [string, string]; neutral: string }> = {
  yesno: { labels: ['Yes', 'No'], neutral: 'Maybe' },
  headstails: { labels: ['Heads', 'Tails'], neutral: 'Balanced' },
  updown: { labels: ['Up', 'Down'], neutral: 'Even' },
}

export function getBinaryLabels(type: BinaryVariant, neutralEnabled: boolean): string[] {
  const meta = binaryMeta[type]
  return neutralEnabled ? [...meta.labels, meta.neutral] : [...meta.labels]
}

export function isBinaryType(type: SessionType): type is BinaryVariant {
  return type in binaryMeta
}

export interface SessionConfig {
  type: SessionType
  options: string[]
}