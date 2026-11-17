import { describe, it, expect } from 'vitest'
import { getImageUrl, getSeedsForOptions } from './imageService'

describe('getImageUrl', () => {
  it('returns a picsum URL with seed and dimensions', () => {
    const url = getImageUrl('Yes', 600, 400)
    expect(url).toBe('https://picsum.photos/seed/Yes/600/400')
  })

  it('encodes special seed characters', () => {
    const url = getImageUrl('Red Option', 300, 200)
    expect(url).toBe('https://picsum.photos/seed/Red%20Option/300/200')
  })

  it('uses default dimensions when omitted', () => {
    const url = getImageUrl('test')
    expect(url).toBe('https://picsum.photos/seed/test/600/400')
  })

  it('is deterministic — same seed returns same URL', () => {
    const a = getImageUrl('foo', 800, 600)
    const b = getImageUrl('foo', 800, 600)
    expect(a).toBe(b)
  })

  it('different seeds return different URLs', () => {
    const a = getImageUrl('Yes')
    const b = getImageUrl('No')
    expect(a).not.toBe(b)
  })
})

describe('getSeedsForOptions', () => {
  it('returns seeds prefixed with session seed', () => {
    const seeds = getSeedsForOptions(['Red', 'Blue'], 42)
    expect(seeds).toEqual(['42-Red-0', '42-Blue-1'])
  })

  it('different session seeds produce different seeds', () => {
    const a = getSeedsForOptions(['Red'], 1)
    const b = getSeedsForOptions(['Red'], 2)
    expect(a[0]).not.toBe(b[0])
  })

  it('ensures unique seeds even for duplicate labels', () => {
    const seeds = getSeedsForOptions(['A', 'A'], 7)
    expect(seeds[0]).not.toBe(seeds[1])
  })

  it('returns empty array for no options', () => {
    expect(getSeedsForOptions([], 99)).toEqual([])
  })
})