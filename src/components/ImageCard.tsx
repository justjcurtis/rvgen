import { useState, useEffect, useRef, useMemo } from 'react'
import type { ImageStatus } from '../hooks/useImages'

interface Props {
  label: string
  imageUrl: string
  revealed: boolean
  onReveal: () => void
  status: ImageStatus
  onLoad: () => void
  onError: () => void
  revealDelay?: number
}

function hash(label: string): number {
  let h = 0
  for (let i = 0; i < label.length; i++) {
    h = ((h << 5) - h) + label.charCodeAt(i)
  }
  return Math.abs(h)
}

const driftNames = ['blob-drift', 'blob-drift2', 'blob-drift3', 'blob-drift4', 'blob-drift5', 'blob-drift6']

export default function ImageCard({
  label,
  imageUrl,
  revealed,
  onReveal,
  status,
  onLoad,
  onError,
  revealDelay = 0,
}: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(!revealed)
  const revealedRef = useRef(revealed)

  const blobTimings = useMemo(() => {
    const h = hash(label)
    return {
      d1: 9 + (h % 13),
      d2: 7 + ((h * 3) % 11),
      d3: 5 + ((h * 7) % 9),
      d4: 8 + ((h * 13) % 12),
      del1: -(h % 16),
      del2: -((h * 5) % 14),
      del3: -((h * 11) % 12),
      del4: -((h * 17) % 15),
      // assign each layer a different drift animation
      a1: driftNames[h % 6],
      a2: driftNames[(h * 3 + 1) % 6],
      a3: driftNames[(h * 7 + 2) % 6],
      a4: driftNames[(h * 11 + 3) % 6],
      // vary inset per layer
      in1: 50 + ((h >> 4) % 20),   // 50–69%
      in2: 45 + ((h >> 6) % 20),   // 45–64%
      in3: 40 + ((h >> 8) % 25),   // 40–64%
      in4: 50 + ((h >> 10) % 15),  // 50–64%
    }
  }, [label])

  useEffect(() => {
    if (revealed && !revealedRef.current) {
      const timer = setTimeout(() => setOverlayVisible(false), revealDelay + 350)
      revealedRef.current = true
      return () => clearTimeout(timer)
    }
    if (!revealed) {
      revealedRef.current = false
      setOverlayVisible(true)
    }
  }, [revealed, revealDelay])

  return (
    <div
      className={`relative rounded-xl overflow-hidden aspect-[3/2] transition-all duration-200 ${
        !revealed
          ? 'shadow-md hover:shadow-xl hover:shadow-purple-400/15 hover:scale-[1.02] bg-gray-800'
          : 'shadow-md bg-gray-800'
      }`}
      aria-label={revealed ? `Image for ${label} revealed` : `Reveal image for ${label}`}
    >
      {/* Loading skeleton */}
      {!imgLoaded && status !== 'error' && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Loading…</span>
        </div>
      )}

      {/* Image — always rendered so onLoad/onError fire */}
      <img
        src={imageUrl}
        alt={label}
        className={`w-full h-full object-cover absolute inset-0 ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        onLoad={() => { setImgLoaded(true); onLoad() }}
        onError={onError}
      />

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">{label}</span>
        </div>
      )}

      {/* Hidden overlay with lava lamp blobs */}
      {overlayVisible && status !== 'error' && (
        <div
          onClick={onReveal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onReveal() } }}
          aria-label={`Reveal image for ${label}`}
          className={`absolute inset-0 cursor-pointer flex items-center justify-center transition-opacity duration-300 focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:outline-none ${
            revealed ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-[#140b28] overflow-hidden">
            <div
              className="absolute"
              style={{
                inset: `-${blobTimings.in1}%`,
                background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(80,25,140,0.7), transparent)',
                animation: `${blobTimings.a1} ${blobTimings.d1}s infinite alternate ease-in-out`,
                animationDelay: `${blobTimings.del1}s`,
              }}
            />
            <div
              className="absolute"
              style={{
                inset: `-${blobTimings.in2}%`,
                background: 'radial-gradient(ellipse 40% 55% at 50% 50%, rgba(140,70,210,0.4), transparent)',
                animation: `${blobTimings.a2} ${blobTimings.d2}s infinite alternate ease-in-out`,
                animationDelay: `${blobTimings.del2}s`,
              }}
            />
            <div
              className="absolute"
              style={{
                inset: `-${blobTimings.in3}%`,
                background: 'radial-gradient(circle 35% at 50% 50%, rgba(210,190,255,0.18), transparent)',
                animation: `${blobTimings.a3} ${blobTimings.d3}s infinite alternate ease-in-out`,
                animationDelay: `${blobTimings.del3}s`,
              }}
            />
            <div
              className="absolute"
              style={{
                inset: `-${blobTimings.in4}%`,
                background: 'radial-gradient(ellipse 30% 40% at 50% 50%, rgba(20,20,25,0.65), transparent)',
                animation: `${blobTimings.a4} ${blobTimings.d4}s infinite alternate ease-in-out`,
                animationDelay: `${blobTimings.del4}s`,
              }}
            />
          </div>
          <span className="relative z-10 text-white font-semibold text-lg drop-shadow-md">
            {label}
          </span>
        </div>
      )}

      {/* Label for revealed cards */}
      {revealed && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
          <span className="text-white text-sm font-medium">{label}</span>
        </div>
      )}
    </div>
  )
}