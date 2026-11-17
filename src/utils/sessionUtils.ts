import type { SessionConfig, BinaryVariant } from '../types'
import { getBinaryLabels } from '../types'

export function generateOptions(
  type: SessionConfig['type'],
  numberedValue: number,
  labels: string[],
  neutralEnabled = false
): string[] {
  if (type === 'yesno' || type === 'headstails' || type === 'updown') {
    return getBinaryLabels(type as BinaryVariant, neutralEnabled)
  }
  if (type === 'numbered') {
    return Array.from({ length: numberedValue }, (_, i) => String(i + 1))
  }
  if (type === 'coordinate') return ['Coordinate']
  return labels
}

export function parseLabels(input: string): string[] {
  return input
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function validateNumbered(value: string): string | null {
  if (value === '') return null
  const n = Number(value)
  if (!Number.isInteger(n)) return 'Must be a whole number'
  if (n < 2) return 'Minimum is 2'
  if (n > 20) return 'Maximum is 20'
  return null
}