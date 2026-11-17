import { useState } from 'react'
import type { SessionType } from '../types'

interface Props {
  value: SessionType
  onChange: (t: SessionType) => void
}

const binaryVariants: { key: SessionType; label: string; icon: string }[] = [
  { key: 'yesno', label: 'Yes / No', icon: '👍👎' },
  { key: 'headstails', label: 'Heads / Tails', icon: '🪙' },
  { key: 'updown', label: 'Up / Down', icon: '⬆️⬇️' },
]

function isBinaryType(t: SessionType) {
  return t === 'yesno' || t === 'headstails' || t === 'updown'
}

export default function SessionTypeSelector({ value, onChange }: Props) {
  const isBinary = isBinaryType(value)
  const [expanded, setExpanded] = useState(isBinary)

  function toggleBinary() {
    if (!isBinary) {
      setExpanded(true)
      onChange('yesno')
    } else {
      setExpanded(!expanded)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Binary - expandable */}
      <div
        className={`border-2 rounded-xl overflow-hidden transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
          isBinary
            ? 'border-indigo-400 bg-indigo-950 shadow-md'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-sm'
        }`}
        role="button"
        tabIndex={0}
        onClick={toggleBinary}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleBinary() } }}
      >
        <div className="p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{isBinary ? binaryVariants.find(v => v.key === value)?.icon : '⚖️'}</span>
            <div className="flex-1">
              <div className="font-semibold text-base">
                {isBinary ? binaryVariants.find(v => v.key === value)?.label : 'Binary'}
              </div>
              <div className="text-xs text-gray-400">
                {isBinary ? 'Two (or three) options' : 'Two binary outcomes'}
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-700 px-2 pb-2 pt-1 flex flex-col gap-1">
            {binaryVariants.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(v.key) }}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
                  value === v.key
                    ? 'bg-indigo-900/60 text-indigo-200'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-sm">{v.icon}</span>
                <span className="text-sm font-medium">{v.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Numbered */}
      <button
        type="button"
        onClick={() => onChange('numbered')}
        className={`border-2 rounded-xl p-3 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
          value === 'numbered'
            ? 'border-indigo-400 bg-indigo-950 shadow-md'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔢</span>
          <div>
            <div className="font-semibold text-base">Numbered</div>
            <div className="text-xs text-gray-400">N numbered options</div>
          </div>
        </div>
      </button>

      {/* Labeled */}
      <button
        type="button"
        onClick={() => onChange('labeled')}
        className={`border-2 rounded-xl p-3 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
          value === 'labeled'
            ? 'border-indigo-400 bg-indigo-950 shadow-md'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏷️</span>
          <div>
            <div className="font-semibold text-base">Labeled</div>
            <div className="text-xs text-gray-400">Custom comma-separated labels</div>
          </div>
        </div>
      </button>

      {/* Coordinate */}
      <button
        type="button"
        onClick={() => onChange('coordinate')}
        className={`border-2 rounded-xl p-3 text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none ${
          value === 'coordinate'
            ? 'border-indigo-400 bg-indigo-950 shadow-md'
            : 'border-gray-700 bg-gray-900 hover:border-gray-600 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <div>
            <div className="font-semibold text-base">Coordinate</div>
            <div className="text-xs text-gray-400">A single image from the seed</div>
          </div>
        </div>
      </button>
    </div>
  )
}