import type { SessionType, BinaryVariant } from '../types'
import { getBinaryLabels, isBinaryType } from '../types'

interface Props {
  type: SessionType
  numberedValue: string
  onNumberedChange: (v: string) => void
  labeledValue: string
  onLabeledChange: (v: string) => void
  parsedLabels: string[]
  neutralEnabled: boolean
  onNeutralChange: (v: boolean) => void
  duplicateLabels: [string, number][]
}

function numberedError(value: string): string | null {
  if (value === '') return null
  const n = Number(value)
  if (!Number.isInteger(n)) return 'Must be a whole number'
  if (n < 2) return 'Minimum is 2'
  if (n > 20) return 'Maximum is 20'
  return null
}

export default function OptionInput({
  type,
  numberedValue,
  onNumberedChange,
  labeledValue,
  onLabeledChange,
  parsedLabels,
  neutralEnabled,
  onNeutralChange,
  duplicateLabels,
}: Props) {
  if (isBinaryType(type)) {
    const labels = getBinaryLabels(type as BinaryVariant, false)
    const neutralLabel = getBinaryLabels(type as BinaryVariant, true)[2]
    return (
      <div className="flex flex-col gap-2">
        <div className="text-xs text-gray-400 bg-gray-900 rounded-lg p-2.5">
          {labels.length} options: {labels.join(', ')}
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={neutralEnabled}
            onChange={(e) => onNeutralChange(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-600 bg-gray-800 accent-indigo-400 cursor-pointer"
          />
          Include neutral option (<span className="text-indigo-400">{neutralLabel}</span>)
        </label>
      </div>
    )
  }

  if (type === 'numbered') {
    const err = numberedError(numberedValue)
    return (
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Number of options
        </label>
        <input
          type="number"
          min={2}
          max={20}
          value={numberedValue}
          onChange={(e) => onNumberedChange(e.target.value)}
          placeholder="Enter number of options"
          className={`w-full border rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-900 text-gray-100 ${err ? 'border-red-400' : 'border-gray-600'}`}
        />
        {err && <p className="text-xs text-red-500 mt-0.5">{err}</p>}
      </div>
    )
  }

  if (type === 'labeled') {
    const tooFew = labeledValue !== '' && parsedLabels.length === 0
    const showError = labeledValue !== '' && (tooFew || duplicateLabels.length > 0)
    return (
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1">
          Labels (comma separated)
        </label>
        <input
          type="text"
          value={labeledValue}
          onChange={(e) => onLabeledChange(e.target.value)}
          placeholder="e.g. Red, Blue, Green"
          className={`w-full border rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-gray-900 text-gray-100 ${showError ? 'border-red-400' : 'border-gray-600'}`}
        />
        {parsedLabels.length > 0 && tooFew && (
          <p className="text-xs text-red-500 mt-0.5">At least 1 label required</p>
        )}
        {parsedLabels.length > 0 && !tooFew && duplicateLabels.length === 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {parsedLabels.length} label{parsedLabels.length > 1 ? 's' : ''} detected
          </p>
        )}
        {duplicateLabels.length > 0 && (
          <p className="text-xs text-red-500 mt-0.5">
            Duplicate{duplicateLabels.length > 1 ? 's' : ''}:{' '}
            {duplicateLabels.map(([l, c]) => `"${l}" (${c}x)`).join(', ')}
          </p>
        )}
      </div>
    )
  }

  if (type === 'coordinate') {
    return (
      <div className="text-xs text-gray-400 bg-gray-900 rounded-lg p-2.5">
        Single image generated from your seed number above.
      </div>
    )
  }

  return null
}