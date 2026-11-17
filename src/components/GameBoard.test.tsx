import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import GameBoard from './GameBoard'

vi.mock('../hooks/useImages', () => ({
  useImages: (options: string[], _seed: number) => ({
    images: options.map((o, i) => ({
      url: `https://picsum.photos/seed/${o}-${i}/600/400`,
      status: 'loaded' as const,
      seed: `${o}-${i}`,
    })),
    onLoad: vi.fn(),
    onError: vi.fn(),
  }),
}))

describe('GameBoard', () => {
  it('renders correct number of image cards', () => {
    const { getByText } = render(<GameBoard options={['Red', 'Blue', 'Green']} sessionType="labeled" sessionSeed={1} />)
    expect(getByText('Red')).toBeInTheDocument()
    expect(getByText('Blue')).toBeInTheDocument()
    expect(getByText('Green')).toBeInTheDocument()
  })

  it('shows reveal counter', () => {
    const { getByText } = render(<GameBoard options={['A', 'B']} sessionType="yesno" sessionSeed={1} />)
    expect(getByText('0 of 2 revealed')).toBeInTheDocument()
  })
})