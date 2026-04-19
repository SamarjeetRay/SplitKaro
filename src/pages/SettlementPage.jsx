// ─── SETTLEMENT PAGE ──────────────────────────────────────────────
// Main grid layout uses .grid-halves CSS class (see index.css)
// which collapses from "1fr 1fr" → "1fr" on mobile (≤640px)
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../store/AppContext'
import { Avatar, Toast } from '../components/SharedComponents'
import { calculateSettlements, getSortedBalances, formatWhatsAppSummary } from '../utils/debtAlgorithm'
import { useToast } from '../hooks/useToast'

export default function SettlementPage() {
  const { groupId } = useParams()
  const { state } = useAppContext()
  const [toastMsg, showToast] = useToast()
  const [copied, setCopied] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  const group = state.groups.find(g => g.id === groupId)

  if (!group) {
    return (
      <div className="page-shell">
        <div className="container" style={{ margin: '0 auto', paddingTop: '3rem' }}>
          <div className="empty-state">
            <span className="empty-state__icon">🔍</span>
            <div className="empty-state__title">Group not found</div>
            <Link to="/groups" className="btn btn-primary">Back to Groups</Link>
          </div>
        </div>
      </div>
    )
  }

  const { transactions, balances } = useMemo(
    () => calculateSettlements(group.members, group.expenses),
    [group.members, group.expenses]
  )

  const sortedBalances = useMemo(() => getSortedBalances(balances), [balances])
  const totalSpent = group.expenses.reduce((sum, e) => sum + e.amount, 0)
  const isAllSettled = transactions.length === 0

  const handleCopy = async () => {
    const text = formatWhatsAppSummary(group.name, transactions)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Copied! Paste into WhatsApp 📱')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      showToast('Could not copy — please copy manually')
    }
  }

  return (
    <div className="page-shell">
      <div className="container" style={{ margin: '0 auto', paddingBottom: '3rem' }}>

        <div className="page-header">
          <div className="page-header__eyebrow">
            <Link to={`/groups/${groupId}/expenses`} style={{ color: 'inherit', textDecoration: 'none' }}>← Expenses</Link>
          </div>
          <div className="flex justify-between items-center wrap gap-3">
            <h1 className="page-header__title">Settlement</h1>
            {!isAllSettled && (
              <button className="btn btn-primary" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📱 Copy for WhatsApp'}
              </button>
            )}
          </div>
          <p className="page-header__sub">{group.name} · ₹{totalSpent.toLocaleString('en-IN')} total</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <Link to={`/groups/${groupId}/expenses`} className="tab">Expenses</Link>
          <div className="tab active">Settlement</div>
        </div>

        {group.expenses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">💸</span>
            <div className="empty-state__title">No expenses yet</div>
            <p className="empty-state__body">Add some expenses first to see who owes whom.</p>
            <Link to={`/groups/${groupId}/expenses`} className="btn btn-primary">Add Expenses</Link>
          </div>
        ) : (
          /* Main content — uses .grid-halves class:
             desktop = "1fr 1fr" (payments + balances side by side)
             mobile  = "1fr"     (stacks vertically) */
          <div className="grid-halves">

            {/* ── Payments needed ── */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>
                {isAllSettled ? '🎉 All settled up!' : `${transactions.length} payment${transactions.length !== 1 ? 's' : ''} needed`}
              </h2>

              {isAllSettled ? (
                <div className="card card--green" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent)' }}>Everyone is square!</div>
                  <p className="text-sm text-muted mt-2">No payments needed.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {transactions.map((t, i) => (
                    <div key={i} className="txn-card">
                      {/* Step */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--accent-soft)', border: '1px solid var(--accent-dim)',
                        color: 'var(--accent)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontFamily: 'var(--font-mono)',
                        fontWeight: 700, fontSize: 12, flexShrink: 0,
                      }}>{i + 1}</div>

                      {/* From */}
                      <div className="flex items-center gap-2">
                        <Avatar name={t.from} size={26} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.from}</span>
                      </div>

                      {/* Amount + arrow */}
                      <div style={{ textAlign: 'center' }}>
                        <div className="txn-amount">₹{t.amount.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: 18, color: 'var(--accent-dim)', lineHeight: 1 }}>→</div>
                      </div>

                      {/* To */}
                      <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.to}</span>
                        <Avatar name={t.to} size={26} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* How it works — simplified */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setShowHowItWorks(v => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--ink-faint)', fontSize: 12, fontFamily: 'var(--font-display)',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 0', letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}
                >
                  <span>{showHowItWorks ? '▾' : '▸'}</span> How the math works
                </button>

                {showHowItWorks && (
                  <div className="card card--flat mt-2" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="math-step">
                      <div className="math-step__num">1</div>
                      <div>
                        <div className="math-step__label">Calculate each person's net</div>
                        <div className="math-step__desc">For each person: <strong>total paid − share of expenses</strong>. Positive = others owe them. Negative = they owe others.</div>
                        <code className="math-formula">net = paid − owed</code>
                      </div>
                    </div>
                    <div className="math-step">
                      <div className="math-step__num">2</div>
                      <div>
                        <div className="math-step__label">Split into two groups</div>
                        <div className="math-step__desc"><strong>Creditors</strong> (net &gt; 0) will receive money. <strong>Debtors</strong> (net &lt; 0) need to pay. Both lists are sorted largest first.</div>
                      </div>
                    </div>
                    <div className="math-step">
                      <div className="math-step__num">3</div>
                      <div>
                        <div className="math-step__label">Match biggest debtor → biggest creditor</div>
                        <div className="math-step__desc">Pay the smaller of the two amounts. The one who hits zero is removed. Repeat until done. This gives you the <strong>fewest possible payments</strong>.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Balances (right) ── */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>Net balances</h2>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th style={{ textAlign: 'right' }}>Paid</th>
                      <th style={{ textAlign: 'right' }}>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBalances.map(({ name, net }) => {
                      const paid = group.expenses.filter(e => e.paidBy === name).reduce((s, e) => s + e.amount, 0)
                      const isPos = net > 0.01
                      const isNeg = net < -0.01
                      return (
                        <tr key={name}>
                          <td>
                            <div className="flex items-center gap-2">
                              <Avatar name={name} size={24} />
                              <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
                            ₹{paid.toLocaleString('en-IN')}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className={isPos ? 'balance-positive' : isNeg ? 'balance-negative' : 'balance-zero'} style={{ fontSize: 13 }}>
                              {isPos ? '+' : ''}₹{Math.abs(net).toFixed(0)}
                            </span>
                            <div className="text-xs text-muted">{isPos ? 'receives' : isNeg ? 'pays' : '✓ even'}</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* WhatsApp preview */}
              {!isAllSettled && (
                <div className="card card--flat mt-4">
                  <div className="section-label mb-2">WhatsApp preview</div>
                  <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)', whiteSpace: 'pre-wrap', lineHeight: 1.6, background: 'var(--bg)', padding: '10px', borderRadius: 8, border: '1px solid var(--border-soft)' }}>
                    {formatWhatsAppSummary(group.name, transactions)}
                  </pre>
                  <button className="btn btn-primary btn-full mt-3" onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Toast msg={toastMsg} />
    </div>
  )
}