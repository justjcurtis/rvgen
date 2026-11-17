import { useState, useCallback } from 'react'
import { getImageUrl, getSeedsForOptions } from '../services/imageService'

export type ImageStatus = 'loading' | 'loaded' | 'error'

interface ImageEntry {
  url: string
  status: ImageStatus
  seed: string
}

export function useImages(options: string[], sessionSeed: number) {
  const seeds = getSeedsForOptions(options, sessionSeed)
  const [images, setImages] = useState<ImageEntry[]>(() =>
    seeds.map((seed) => ({
      url: getImageUrl(seed),
      status: 'loading' as ImageStatus,
      seed,
    }))
  )

  const onLoad = useCallback((index: number) => {
    setImages((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], status: 'loaded' }
      return next
    })
  }, [])

  const onError = useCallback((index: number) => {
    setImages((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], status: 'error' }
      return next
    })
  }, [])

  return { images, onLoad, onError }
}