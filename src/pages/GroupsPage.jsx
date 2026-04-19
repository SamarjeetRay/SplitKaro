import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { Avatar, Toast } from '../components/SharedComponents'
import { useToast } from '../hooks/useToast'

export default function GroupsPage() {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate()
  const [toastMsg, showToast] = useToast()

  const totalAmount = (group) => group.expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleDelete = (groupId, groupName) => {
    if (!window.confirm(`Delete "${groupName}"? This cannot be undone.`)) return
    dispatch({ type: 'DELETE_GROUP', payload: groupId })
    showToast('Group deleted')
  }

  const handleOpen = (groupId) => {
    dispatch({ type: 'SET_ACTIVE_GROUP', payload: groupId })
    navigate(`/groups/${groupId}/expenses`)
  }

  return (
    <div className="page-shell">
      <div className="container" style={{ margin: '0 auto', paddingBottom: '3rem' }}>

        <div className="page-header">
          <div className="page-header__eyebrow">Your groups</div>
          <div className="flex justify-between items-center wrap gap-3">
            <h1 className="page-header__title">Groups</h1>
            <Link to="/groups/new" className="btn btn-primary">+ New Group</Link>
          </div>
          <p className="page-header__sub">
            {state.groups.length} group{state.groups.length !== 1 ? 's' : ''} saved locally
          </p>
        </div>

        {state.groups.length === 0 && (
          <div className="empty-state">
            <span className="empty-state__icon">🧳</span>
            <div className="empty-state__title">No groups yet</div>
            <p className="empty-state__body">Create your first group for a trip, dinner, or any shared expense.</p>
            <Link to="/groups/new" className="btn btn-primary">Create your first group</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {state.groups.map(group => (
            <div key={group.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                    {group.name}
                  </h2>
                  <span className="text-xs text-muted">
                    {new Date(group.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className="badge badge-gray">{group.members.length} members</span>
              </div>

              {/* Avatars */}
              <div className="flex gap-1 wrap">
                {group.members.slice(0, 6).map(m => (
                  <Avatar key={m} name={m} size={30} />
                ))}
                {group.members.length > 6 && (
                  <div className="avatar" style={{
                    width: 30, height: 30,
                    background: 'var(--bg-raised)',
                    color: 'var(--ink-faint)',
                    fontSize: 10, fontWeight: 700,
                    border: '1px solid var(--border)',
                  }}>+{group.members.length - 6}</div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-2">
                <div style={{ flex: 1, background: 'var(--bg-raised)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border-soft)' }}>
                  <div className="section-label mb-1">Expenses</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>
                    {group.expenses.length}
                  </div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-raised)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--border-soft)' }}>
                  <div className="section-label mb-1">Total</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>
                    ₹{totalAmount(group).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleOpen(group.id)}>
                  Open
                </button>
                <Link
                  to={`/groups/${group.id}/settlement`}
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_GROUP', payload: group.id })}
                >
                  Settle
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(group.id, group.name)}
                  title="Delete group"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast msg={toastMsg} />
    </div>
  )
}
