import { describe, it, expect } from 'vitest'
import { generateOptions, parseLabels, validateNumbered } from './sessionUtils'

describe('generateOptions', () => {
  it('yesno generates Yes and No', () => {
    expect(generateOptions('yesno', 0, [])).toEqual(['Yes', 'No'])
  })

  it('yesno with neutral adds Maybe', () => {
    expect(generateOptions('yesno', 0, [], true)).toEqual(['Yes', 'No', 'Maybe'])
  })

  it('headstails generates Heads and Tails', () => {
    expect(generateOptions('headstails', 0, [])).toEqual(['Heads', 'Tails'])
  })

  it('headstails with neutral adds Balanced', () => {
    expect(generateOptions('headstails', 0, [], true)).toEqual(['Heads', 'Tails', 'Balanced'])
  })

  it('updown generates Up and Down', () => {
    expect(generateOptions('updown', 0, [])).toEqual(['Up', 'Down'])
  })

  it('updown with neutral adds Even', () => {
    expect(generateOptions('updown', 0, [], true)).toEqual(['Up', 'Down', 'Even'])
  })

  it('numbered generates correct count', () => {
    expect(generateOptions('numbered', 5, [])).toEqual(['1', '2', '3', '4', '5'])
  })

  it('numbered with N=1 still produces array of 1', () => {
    expect(generateOptions('numbered', 1, [])).toEqual(['1'])
  })

  it('labeled returns labels as-is', () => {
    expect(generateOptions('labeled', 0, ['Red', 'Blue'])).toEqual(['Red', 'Blue'])
  })

  it('coordinate returns single option', () => {
    expect(generateOptions('coordinate', 0, [])).toEqual(['Coordinate'])
  })
})

describe('parseLabels', () => {
  it('splits on comma', () => {
    expect(parseLabels('Red,Blue,Green')).toEqual(['Red', 'Blue', 'Green'])
  })

  it('handles comma with spaces', () => {
    expect(parseLabels('Red, Blue, Green')).toEqual(['Red', 'Blue', 'Green'])
  })

  it('trims whitespace around labels', () => {
    expect(parseLabels('  Red , Blue  ')).toEqual(['Red', 'Blue'])
  })

  it('drops empty entries', () => {
    expect(parseLabels('Red,,Blue')).toEqual(['Red', 'Blue'])
  })

  it('requires at least 2 labels — returns 1', () => {
    expect(parseLabels('Red')).toEqual(['Red'])
  })

  it('returns empty for empty input', () => {
    expect(parseLabels('')).toEqual([])
  })
})

describe('validateNumbered', () => {
  it('returns null for empty string', () => {
    expect(validateNumbered('')).toBeNull()
  })

  it('rejects non-integer', () => {
    expect(validateNumbered('1.5')).toBe('Must be a whole number')
  })

  it('rejects < 2', () => {
    expect(validateNumbered('1')).toBe('Minimum is 2')
    expect(validateNumbered('0')).toBe('Minimum is 2')
  })

  it('rejects > 20', () => {
    expect(validateNumbered('21')).toBe('Maximum is 20')
  })

  it('returns null for valid values', () => {
    expect(validateNumbered('5')).toBeNull()
    expect(validateNumbered('2')).toBeNull()
    expect(validateNumbered('20')).toBeNull()
  })
})