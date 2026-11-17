import { useState, useRef, useCallback } from 'react'

interface Props {
  seed: number
  onChange: (seed: number) => void
}

export default function SeedBadge({ seed, onChange }: Props) {
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState<'shown' | 'hiding' | false>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(seed))
    clearTimeout(fadeTimer.current)
    setCopied('shown')
    fadeTimer.current = setTimeout(() => setCopied('hiding'), 1250)
    setTimeout(() => setCopied(false), 1500)
  }, [seed])

  function startEdit() {
    setEditing(true)
  }

  function commitEdit() {
    const val = parseInt(inputRef.current?.value ?? '', 10)
    if (!isNaN(val) && val >= 0) onChange(val)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-500 font-mono">seed</span>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            min={0}
            defaultValue={seed}
            autoFocus
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="w-20 border border-gray-600 rounded px-1.5 py-0.5 font-mono text-xs outline-none focus:ring-1 focus:ring-indigo-400 bg-gray-900 text-gray-100"
          />
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="font-mono text-gray-300 bg-gray-800 hover:bg-gray-700 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
            title="Click to edit"
          >
            {seed}
          </button>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer p-0.5"
          title="Copy seed"
          aria-label="Copy seed to clipboard"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </div>
      {copied && (
        <span
          className={`absolute top-full right-0 mt-1 text-green-500 text-xs font-sans whitespace-nowrap transition-opacity duration-250 ${
            copied === 'hiding' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          copied!
        </span>
      )}
    </div>
  )
}