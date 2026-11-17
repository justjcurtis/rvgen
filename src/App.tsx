import { useState, useMemo } from 'react'
import Header from './components/Header'
import SessionTypeSelector from './components/SessionTypeSelector'
import OptionInput from './components/OptionInput'
import GameBoard from './components/GameBoard'
import SeedBadge from './components/SeedBadge'
import type { SessionConfig, SessionType } from './types'
import { generateOptions } from './utils/sessionUtils'

function randomSeed() {
  return Math.floor(Math.random() * 1000000)
}

function App() {
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [sessionType, setSessionType] = useState<SessionType>('yesno')
  const [numberedValue, setNumberedValue] = useState('')
  const [labeledValue, setLabeledValue] = useState('')
  const [sessionSeed, setSessionSeed] = useState(randomSeed)
  const [neutralEnabled, setNeutralEnabled] = useState(false)

  const parsedLabels = useMemo(
    () =>
      labeledValue
        .split(/,\s*/)
        .map((s) => s.trim())
        .filter(Boolean),
    [labeledValue],
  )

  const numberedNum = Number(numberedValue)
  const numberedValid =
    numberedValue !== '' &&
    Number.isInteger(numberedNum) &&
    numberedNum >= 2 &&
    numberedNum <= 20
  const duplicateLabels = useMemo(() => {
    const counts = new Map<string, number>()
    for (const l of parsedLabels) counts.set(l, (counts.get(l) || 0) + 1)
    return [...counts.entries()].filter(([_, c]) => c > 1)
  }, [parsedLabels])

  const labeledValid = parsedLabels.length >= 1 && duplicateLabels.length === 0
  const canStart =
    sessionType === 'yesno' ||
    sessionType === 'headstails' ||
    sessionType === 'updown' ||
    sessionType === 'coordinate' ||
    (sessionType === 'numbered' && numberedValid) ||
    (sessionType === 'labeled' && labeledValid)

  function startSession() {
    const options = generateOptions(sessionType, numberedNum, parsedLabels, neutralEnabled)
    setSessionConfig({ type: sessionType, options })
  }

  function resetSession() {
    setSessionConfig(null)
  }

  const topBar = (
    <div className="flex items-center justify-between px-4 pt-2">
      <div />
      <SeedBadge seed={sessionSeed} onChange={setSessionSeed} />
    </div>
  )

  if (sessionConfig) {
    return (
      <div className="min-h-screen bg-gray-950">
        {topBar}
        <Header />
        <main className="px-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400 bg-gray-800 rounded-full px-3 py-1">
              {sessionConfig.type} — {sessionConfig.options.length} options
            </span>
            <button
              type="button"
              onClick={resetSession}
              className="text-sm text-indigo-400 hover:text-indigo-300 underline cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none rounded"
            >
              New Session
            </button>
          </div>
          <GameBoard
            options={sessionConfig.options}
            sessionType={sessionConfig.type}
            sessionSeed={sessionSeed}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {topBar}
      <Header />
      <main className="max-w-md mx-auto px-4">
        <h2 className="text-lg font-semibold text-center mb-4 pt-1">
          Choose a session type
        </h2>
        <div className="flex flex-col gap-3">
          <SessionTypeSelector value={sessionType} onChange={setSessionType} />
          <OptionInput
            type={sessionType}
            numberedValue={numberedValue}
            onNumberedChange={setNumberedValue}
            labeledValue={labeledValue}
            onLabeledChange={setLabeledValue}
            parsedLabels={parsedLabels}
            neutralEnabled={neutralEnabled}
            onNeutralChange={setNeutralEnabled}
            duplicateLabels={duplicateLabels}
          />
          <button
            type="button"
            onClick={startSession}
            disabled={!canStart}
            className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
          >
            Start Session
          </button>
        </div>
      </main>
    </div>
  )
}

export default App