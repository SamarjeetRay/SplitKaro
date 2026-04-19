// ─── DEBT SIMPLIFICATION ALGORITHM ───────────────────────────────
// [L44] Reference Types: Objects & Arrays — balances is a plain object map
// [L48] Common In-Built Objects — uses Math.abs, Math.round, Math.min
//
// 🎯 GREEDY ALGORITHM 
// ────────────────────────────────────────────────────
// Problem: Given N people with complex expense splits,
//          find the MINIMUM number of transactions to settle all debts.
//
// Why GREEDY works here:
//   At each step we pick the globally optimal move:
//   match the BIGGEST debtor with the BIGGEST creditor.
//   This eliminates at least one person per transaction (whoever hits 0),
//   so we can never do better — greedy gives the true minimum.
//
// Steps:
//   1. net[person] = totalPaid − totalOwed  (linear scan O(n))
//   2. Split into creditors (net > 0) and debtors (net < 0)
//   3. Sort both descending                 (O(n log n))
//   4. Two-pointer greedy match:
//        transfer = min(debt, credit)
//        advance the pointer that hits 0
//   5. Repeat until empty                   (at most n−1 steps)
//
// Time:  O(n log n)  — dominated by the sort
// Space: O(n)        — two arrays of at most n entries
//
// The math guarantee:
//   If there are k non-zero balances, you need AT MOST k-1 transactions.
//   Proof: each transaction zeroes out at least one person,
//   so after k-1 steps the last person must also be zero (all balances sum to 0).

export function calculateSettlements(members, expenses) {

  // ── Step 1: Build net balance map ─────────────────────────────
  // [L44] Object literal + forEach — classic reference type usage
  // [L40] Variables and Data Types — number arithmetic
  const balances = {}
  members.forEach(m => (balances[m] = 0))   // [L43] Arrow functions

  expenses.forEach(({ amount, paidBy, splitAmong }) => {  // [L44] Object destructuring
    if (!splitAmong || splitAmong.length === 0) return

    balances[paidBy] = (balances[paidBy] ?? 0) + amount   // [L41] Nullish coalescing

    const perPerson = amount / splitAmong.length
    splitAmong.forEach(person => {
      balances[person] = (balances[person] ?? 0) - perPerson
    })
  })

  // ── Step 2: Separate into creditors and debtors ────────────────
  // [L44] Object.entries converts object to [key, value] pairs
  const creditors = []
  const debtors   = []

  Object.entries(balances).forEach(([name, bal]) => {  // [L44] Array destructuring
    if (Math.abs(bal) < 0.01) return
    if (bal > 0) creditors.push({ name, amount: bal })
    else         debtors.push({ name, amount: -bal })
  })

  // ── Step 3: Greedy matching ────────────────────────────────────
  // [L44] Array.sort with comparator (descending)
  creditors.sort((a, b) => b.amount - a.amount)  // [L43] Arrow function comparator
  debtors.sort((a, b) => b.amount - a.amount)

  // [L41] while loop + two-pointer technique
  const transactions = []
  let ci = 0, di = 0

  while (ci < creditors.length && di < debtors.length) {
    const cred = creditors[ci]
    const debt = debtors[di]

    // GREEDY CHOICE: transfer the smaller of the two — zeros one out
    const amount = Math.min(cred.amount, debt.amount)  // [L48] Math.min

    transactions.push({    // [L44] Array.push + object shorthand
      from:   debt.name,
      to:     cred.name,
      amount: Math.round(amount * 100) / 100,  // [L48] Math.round
    })

    cred.amount -= amount
    debt.amount -= amount

    if (cred.amount < 0.01) ci++
    if (debt.amount < 0.01) di++
  }

  return { transactions, balances }  // [L44] Object shorthand
}

// [L44] Object.entries + map + sort chain
export function getSortedBalances(balances) {
  return Object.entries(balances)
    .map(([name, net]) => ({ name, net }))
    .sort((a, b) => b.net - a.net)
}

// [L42] Template literals + array spread + join
export function formatWhatsAppSummary(groupName, transactions) {
  if (transactions.length === 0) {
    return `✅ ${groupName} — All settled up! No payments needed.`
  }

  const lines = [
    `💰 *SplitKaro — ${groupName}*`,
    `📋 Settlement Summary:`,
    ``,
    ...transactions.map(
      (t, i) => `${i + 1}. ${t.from} → ${t.to}: ₹${t.amount.toFixed(0)}`
    ),
    ``,
    `_Calculated via SplitKaro_`
  ]

  return lines.join('\n')
}
