import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    render(<GameBoard options={['Red', 'Blue', 'Green']} sessionType="labeled" sessionSeed={1} />)
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
    expect(screen.getByText('Green')).toBeInTheDocument()
  })

  it('shows reveal counter', () => {
    render(<GameBoard options={['A', 'B']} sessionType="yesno" sessionSeed={1} />)
    expect(screen.getByText('0 of 2 revealed')).toBeInTheDocument()
  })
})