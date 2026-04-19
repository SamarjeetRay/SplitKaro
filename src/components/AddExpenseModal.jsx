// ─── ADD EXPENSE MODAL ─────────────────────────────────────────────
// [L71] React Hook Form — register, handleSubmit, watch, setValue, formState
// [L62] useState (via RHF internal) — form field state managed by hook
// [L67] Event Handling — onSubmit, onChange, onClick handlers
// [L61] Props: members, onAdd, onClose — data flows DOWN via props

import { useForm } from 'react-hook-form'  // [L71] React Hook Form
import { Modal, Avatar } from './SharedComponents'  // [L61] component import

export function AddExpenseModal({ members, onAdd, onClose }) {  // [L61] destructured props

  // [L71] useForm — initialises form state, validation, watch
  const {
    register,     // [L71] connects input to RHF
    handleSubmit, // [L71] wraps submit with validation
    watch,        // [L71] subscribes to live field values
    setValue,     // [L71] programmatically set field
    formState: { errors },  // [L44] destructuring nested object
  } = useForm({ defaultValues: { splitAmong: members, paidBy: '' } })

  const paidBy = watch('paidBy')
  const splitAmong = watch('splitAmong') ?? []

  // [L67] Event handler — toggle member in/out of split
  const toggleMember = (name) => {
    const current = splitAmong.includes(name)
      ? splitAmong.filter(m => m !== name)
      : [...splitAmong, name]
    setValue('splitAmong', current, { shouldValidate: true })
  }

  const toggleAll = () => {
    setValue('splitAmong', splitAmong.length === members.length ? [] : [...members])
  }

  const onSubmit = (data) => {
    onAdd({
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      paidBy: data.paidBy,
      splitAmong: data.splitAmong,
    })
    onClose()
  }

  const amount = parseFloat(watch('amount')) || 0
  const shareCount = splitAmong.length
  const perPerson = shareCount > 0 ? (amount / shareCount).toFixed(2) : 0

  return (
    <Modal title="Add Expense" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        <div className="field mb-4">
          <label>What was it for?</label>
          <input
            placeholder="e.g. Hotel, Petrol, Dinner at Dhaba"
            className={errors.description ? 'error' : ''}
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <span className="field-error">{errors.description.message}</span>}
        </div>

        <div className="field mb-4">
          <label>Amount (₹)</label>
          <input
            type="number" min="1" step="0.01" placeholder="0.00"
            className={errors.amount ? 'error' : ''}
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 1, message: 'Must be at least ₹1' },
            })}
          />
          {errors.amount && <span className="field-error">{errors.amount.message}</span>}
        </div>

        {/* ❌ Paid By untouched */}
        <div className="field mb-4">
          <label>Paid by</label>
          <div className="card card--flat" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {members.map(m => (
              <div
                key={m}
                onClick={() => setValue('paidBy', m, { shouldValidate: true })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: paidBy === m ? '2px solid var(--accent)' : '1px solid var(--border)',
                  background: paidBy === m ? 'rgba(0, 200, 83, 0.08)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={m} size={22} />
                  <span style={{ fontWeight: 500 }}>{m}</span>
                </div>
                {paidBy === m && <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
          {errors.paidBy && <span className="field-error">{errors.paidBy.message}</span>}
        </div>

        {/* ✅ SPLIT AMONG FIXED */}
        <div className="field mb-4">
          <div className="flex justify-between items-center mb-2">
            <label style={{ margin: 0 }}>Split among</label>
            <button type="button" className="btn btn-ghost btn-sm" onClick={toggleAll}>
              {splitAmong.length === members.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="card card--flat split-list">
            {members.map(m => (
              <div
                key={m}
                onClick={() => toggleMember(m)}
                className={`split-option ${splitAmong.includes(m) ? 'active' : ''}`}
              >
                <div className="split-left">
                  <Avatar name={m} size={22} />
                  <span>{m}</span>
                </div>

                {/* ✅ Tick */}
                {splitAmong.includes(m) && <span className="split-tick">✓</span>}
              </div>
            ))}
          </div>

          {splitAmong.length === 0 && <span className="field-error">Select at least one person</span>}
        </div>

        {amount > 0 && splitAmong.length > 0 && (
          <div className="card card--green mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                ₹{amount.toFixed(0)} ÷ {shareCount} people
              </span>
              <span className="font-mono font-bold text-accent">
                ₹{perPerson} each
              </span>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full" disabled={splitAmong.length === 0}>
          Add Expense
        </button>
      </form>
    </Modal>
  )
}