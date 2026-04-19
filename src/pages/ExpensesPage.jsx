import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { Avatar, Toast } from '../components/SharedComponents'
import { AddExpenseModal } from '../components/AddExpenseModal'
import { calculateSettlements } from '../utils/debtAlgorithm'
import { useToast } from '../hooks/useToast'

export default function ExpensesPage() {
  const { groupId } = useParams()
  const { state, dispatch } = useAppContext()
  const [showModal, setShowModal] = useState(false)
  const [toastMsg, showToast] = useToast()

  const group = state.groups.find(g => g.id === groupId)

  if (!group) {
    return (
      <div className="page-shell">
        <div className="container" style={{ margin: '0 auto', paddingTop: '3rem' }}>
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <div className="empty-state__title">Group not found</div>
            <p className="empty-state__body">This group may have been deleted.</p>
            <Link to="/groups" className="btn btn-primary">Back to Groups</Link>
          </div>
        </div>
      </div>
    )
  }

  const { balances } = useMemo(
    () => calculateSettlements(group.members, group.expenses),
    [group.members, group.expenses]
  )

  const totalSpent = group.expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleAddExpense = (expenseData) => {
    dispatch({ type: 'SET_ACTIVE_GROUP', payload: groupId })
    dispatch({ type: 'ADD_EXPENSE', payload: expenseData })
    showToast('Expense added!')
  }

  const handleDelete = (expenseId, description) => {
    if (!window.confirm(`Remove "${description}"?`)) return
    dispatch({ type: 'SET_ACTIVE_GROUP', payload: groupId })
    dispatch({ type: 'DELETE_EXPENSE', payload: expenseId })
    showToast('Expense removed')
  }

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

  return (
    <div className="page-shell">
      <div className="container" style={{ margin: '0 auto', paddingBottom: '3rem' }}>

        <div className="page-header">
          <div className="page-header__eyebrow">
            <Link to="/groups" style={{ color: 'inherit', textDecoration: 'none' }}>← Groups</Link>
          </div>
          <div className="flex justify-between items-center wrap gap-3">
            <h1 className="page-header__title">{group.name}</h1>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Expense</button>
          </div>
          <div className="flex gap-2 wrap mt-2">
            {group.members.map(m => (
              <div key={m} className="member-tag">
                <Avatar name={m} size={18} />{m}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className="tab active">Expenses</div>
          <Link to={`/groups/${groupId}/settlement`} className="tab">Settlement</Link>
        </div>

        {/* Stats — uses .grid-stats class for responsive 3-col layout */}
        <div className="grid-stats">
          {[
            { label: 'Total spent', value: `₹${totalSpent.toLocaleString('en-IN')}` },
            { label: 'Expenses', value: group.expenses.length },
            { label: 'Members', value: group.members.length },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card__label">{s.label}</div>
              <div className="stat-card__value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Main content — uses .grid-sidebar class:
            desktop = "1fr 280px" (expenses list + balance sidebar)
            mobile  = "1fr"       (stacks vertically, sidebar moves below) */}
        <div className="grid-sidebar">

          {/* Expenses list */}
          <div>
            {group.expenses.length === 0 ? (
              <div className="card empty-state">
                <span className="empty-state__icon">🧾</span>
                <div className="empty-state__title">No expenses yet</div>
                <p className="empty-state__body">Add your first expense to start tracking.</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add First Expense</button>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Paid by</th>
                        <th>Split</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...group.expenses].reverse().map(expense => (
                        <tr key={expense.id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{expense.description}</div>
                            <div className="text-xs text-muted">{fmtDate(expense.date)}</div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Avatar name={expense.paidBy} size={22} />
                              <span className="text-sm">{expense.paidBy}</span>
                            </div>
                          </td>
                          <td><span className="badge badge-gray">{expense.splitAmong.length} people</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                              ₹{expense.amount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expense.id, expense.description)}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Balance sidebar — sticky on desktop, normal flow on mobile */}
          <div className="card" style={{ position: 'sticky', top: 72 }}>
            <div className="section-label mb-3">Balance Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.members.map(m => {
                const net = balances[m] ?? 0
                const absNet = Math.abs(net)
                const isPositive = net > 0.01
                const isNegative = net < -0.01
                return (
                  <div key={m} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={m} size={26} />
                      <span className="text-sm" style={{ fontWeight: 500 }}>{m}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={isPositive ? 'balance-positive' : isNegative ? 'balance-negative' : 'balance-zero'} style={{ fontSize: 12 }}>
                        {isPositive ? '+' : isNegative ? '-' : ''}₹{absNet.toFixed(0)}
                      </span>
                      <div className="text-xs text-muted">{isPositive ? 'receives' : isNegative ? 'owes' : 'even'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <hr className="divider" />
            <Link to={`/groups/${groupId}/settlement`} className="btn btn-secondary btn-full btn-sm">
              View Settlement →
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <AddExpenseModal members={group.members} onAdd={handleAddExpense} onClose={() => setShowModal(false)} />
      )}
      <Toast msg={toastMsg} />
    </div>
  )
}