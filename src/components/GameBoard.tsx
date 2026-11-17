import { useState, useCallback, useEffect } from 'react'
import ImageCard from './ImageCard'
import { useImages } from '../hooks/useImages'

interface Props {
  options: string[]
  sessionType: string
  sessionSeed: number
}

export default function GameBoard({ options, sessionSeed }: Props) {
  const { images, onLoad, onError } = useImages(options, sessionSeed)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [revealAllTime, setRevealAllTime] = useState(0)

  const revealOption = useCallback((index: number) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  const revealAll = useCallback(() => {
    setRevealAllTime(Date.now())
    setRevealed(new Set(options.map((_, i) => i)))
  }, [options])

  const hideAll = useCallback(() => {
    setRevealAllTime(0)
    setRevealed(new Set())
  }, [])

  const revealNext = useCallback(() => {
    setRevealed((prev) => {
      const next = new Set(prev)
      for (let i = 0; i < options.length; i++) {
        if (!next.has(i)) {
          next.add(i)
          break
        }
      }
      return next
    })
  }, [options])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.repeat) {
        e.preventDefault()
        revealAll()
      } else if (e.key === ' ') {
        e.preventDefault()
        revealNext()
      } else if (e.key === 'h' || e.key === 'H') {
        hideAll()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [revealAll, revealNext, hideAll])

  const revealedCount = revealed.size

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-sm text-gray-400"
          role="status"
          aria-live="polite"
          aria-label={`${revealedCount} of ${options.length} revealed`}
        >
          {revealedCount} of {options.length} revealed
        </span>
        <div className="flex items-center gap-2">
          {revealedCount > 0 && (
            <button
              type="button"
              onClick={hideAll}
              className="text-sm text-gray-400 hover:text-gray-300 underline cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
            >
              Hide All
            </button>
          )}
          <button
            type="button"
            onClick={revealAll}
            disabled={revealedCount === options.length}
            className="bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            Reveal All
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6 ${options.length === 1 ? 'max-w-3xl mx-auto' : ''}`}>
        {images.map((img, i) => (
          <ImageCard
            key={i}
            label={options[i]}
            imageUrl={img.url}
            revealed={revealed.has(i)}
            onReveal={() => revealOption(i)}
            status={img.status}
            onLoad={() => onLoad(i)}
            onError={() => onError(i)}
            revealDelay={revealed.has(i) && revealAllTime > 0 ? i * 50 : 0}
          />
        ))}
      </div>
    </div>
  )
}