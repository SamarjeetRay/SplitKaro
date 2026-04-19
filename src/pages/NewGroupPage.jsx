import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { Avatar } from '../components/SharedComponents'

const SUGGESTIONS = ['Goa Trip', 'Office Lunch', 'Flat Expenses', 'Road Trip', 'Wedding Trip', 'Movie Night']

export default function NewGroupPage() {
  const { dispatch } = useAppContext()
  const navigate = useNavigate()

  const [groupName, setGroupName]     = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [members, setMembers]         = useState([])
  const [error, setError]             = useState('')

  const addMember = () => {
    const name = memberInput.trim()
    if (!name) return
    if (members.map(m => m.toLowerCase()).includes(name.toLowerCase())) {
      setError('Member already added')
      return
    }
    setMembers(prev => [...prev, name])
    setMemberInput('')
    setError('')
  }

  const removeMember = (name) => setMembers(prev => prev.filter(m => m !== name))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addMember() }
  }

  const handleCreate = () => {
    if (!groupName.trim()) { setError('Please enter a group name'); return }
    if (members.length < 2) { setError('Add at least 2 members'); return }
    dispatch({ type: 'CREATE_GROUP', payload: { name: groupName.trim(), members } })
    navigate('/groups')
  }

  return (
    <div className="page-shell">
      <div className="container container--narrow" style={{ margin: '0 auto', paddingBottom: '3rem' }}>

        <div className="page-header">
          <div className="page-header__eyebrow">
            <Link to="/groups" style={{ color: 'inherit', textDecoration: 'none' }}>← Groups</Link>
          </div>
          <h1 className="page-header__title">New Group</h1>
          <p className="page-header__sub">Set up a group for a trip, dinner, or any shared expense.</p>
        </div>

        {/* Group name */}
        <div className="card mb-4">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>Group name</h2>
          <div className="field mb-3">
            <label>Name</label>
            <input
              value={groupName}
              onChange={e => { setGroupName(e.target.value); setError('') }}
              placeholder="e.g. Goa Trip 2025"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && document.getElementById('member-input').focus()}
            />
          </div>
          <div className="section-label mb-2">Quick suggestions</div>
          <div className="flex gap-2 wrap">
            {SUGGESTIONS.map(s => (
              <button key={s} type="button" className="btn btn-ghost btn-sm" onClick={() => setGroupName(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="card mb-4">
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>
            Members
            <span style={{ color: 'var(--ink-faint)', fontWeight: 400, fontSize: 13, marginLeft: 8 }}>(min 2)</span>
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              id="member-input"
              value={memberInput}
              onChange={e => { setMemberInput(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="Enter name and press Add"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary" onClick={addMember}>
              + Add
            </button>
          </div>

          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--ink-faint)', fontSize: 13, background: 'var(--bg-raised)', borderRadius: 10, border: '1px dashed var(--border)' }}>
              No members yet — add at least 2
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {members.map((m, i) => (
                <div key={m} className="flex items-center justify-between" style={{
                  padding: '8px 12px',
                  background: 'var(--bg-raised)',
                  borderRadius: 8,
                  border: '1px solid var(--border-soft)',
                }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)', fontWeight: 600, minWidth: 20 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Avatar name={m} size={30} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{m}</span>
                  </div>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMember(m)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚠ {error}
          </div>
        )}

        {members.length >= 2 && groupName.trim() && (
          <div className="card card--green mb-4" style={{ padding: '0.85rem 1rem' }}>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>Ready to create</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)', fontSize: 13 }}>
                {groupName} · {members.length} members
              </span>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleCreate}
          disabled={!groupName.trim() || members.length < 2}
        >
          Create Group →
        </button>
      </div>
    </div>
  )
}
