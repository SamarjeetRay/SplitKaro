// ─── APP ROOT ─────────────────────────────────────────────────────
// [L70] React Router v6 — Routes, Route, and nested routing
// [L69] useContext — AppProvider wraps everything for global state
// [L61] Components — each page is a separate component
//
// Route structure:
//   /                          → HomePage (landing)
//   /groups                    → GroupsPage (list all groups)
//   /groups/new                → NewGroupPage (create group form)
//   /groups/:groupId/expenses  → ExpensesPage (add/view expenses)
//   /groups/:groupId/settlement→ SettlementPage (debt summary)

import { Routes, Route } from 'react-router-dom'   // [L70] React Router
import { AppProvider, ThemeProvider } from './store/AppContext'  // [L69] Context providers
import { Navbar } from './components/SharedComponents'

// [L61] Component imports — each file exports one default component
import HomePage       from './pages/HomePage'
import GroupsPage     from './pages/GroupsPage'
import NewGroupPage   from './pages/NewGroupPage'
import ExpensesPage   from './pages/ExpensesPage'
import SettlementPage from './pages/SettlementPage'

// [L61] Root component — composes providers + router + pages
export default function App() {
  return (
    // [L69] ThemeProvider wraps outermost — all components can access theme
    <ThemeProvider>
      {/* [L69] AppProvider — injects state + dispatch into context */}
      <AppProvider>
        <Navbar />
        {/* [L70] Routes — only renders the first matching Route */}
        <Routes>
          <Route path="/"                              element={<HomePage />} />
          <Route path="/groups"                        element={<GroupsPage />} />
          <Route path="/groups/new"                    element={<NewGroupPage />} />
          {/* [L70] :groupId — URL param, accessed via useParams() */}
          <Route path="/groups/:groupId/expenses"      element={<ExpensesPage />} />
          <Route path="/groups/:groupId/settlement"    element={<SettlementPage />} />
          <Route path="*"                              element={<HomePage />} />
        </Routes>
      </AppProvider>
    </ThemeProvider>
  )
}
