// ─── SHARED COMPONENTS ────────────────────────────────────────────
// [L61] Components: small reusable UI pieces — Avatar, Toast, Modal, Navbar
// [L62] useState — for install button state and theme toggle
// [L68] useEffect — for PWA install prompt event listener
// [L69] useContext — useTheme consumes ThemeContext from AppContext

import { NavLink } from 'react-router-dom'  // [L70] React Router NavLink (auto active class)
import { useState, useEffect } from 'react'
import { useTheme } from '../store/AppContext'  // [L69] custom hook

// ── Avatar ─────────────────────────────────────────────────────────
// [L61] Props: name + size — reusable avatar from any name string
// [L41] Modulus operator — picks a color deterministically from name's char code
const AVATAR_COLORS = [
  ['rgba(110,231,183,0.15)', '#6ee7b7'],
  ['rgba(96,165,250,0.15)',  '#60a5fa'],
  ['rgba(251,191,36,0.15)',  '#fbbf24'],
  ['rgba(255,107,107,0.15)', '#ff6b6b'],
  ['rgba(167,139,250,0.15)', '#a78bfa'],
  ['rgba(251,146,60,0.15)',  '#fb923c'],
]

export function Avatar({ name = '?', size = 36 }) {  // [L47] default param
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length  // [L41] modulus
  const [bg, fg] = AVATAR_COLORS[idx]  // [L44] array destructuring
  const initials = name.slice(0, 2).toUpperCase()  // [L42] string methods

  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, color: fg, fontSize: Math.floor(size * 0.36), border: `1.5px solid ${fg}40` }}>
      {initials}
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────
// [L66] Conditional Rendering — returns null if no msg
export function Toast({ msg }) {
  if (!msg) return null  // [L66] conditional render
  return (
    <div className="toast">
      <span className="toast-check">✓</span>
      {msg}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────
// [L67] Event Handling — stopPropagation prevents overlay click closing modal
// [L64] children prop — renders whatever JSX is passed inside <Modal>
export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>  {/* [L67] onClick closes on overlay click */}
      <div className="modal" onClick={e => e.stopPropagation()}>  {/* [L67] stop bubbling */}
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}  {/* [L64] children prop */}
      </div>
    </div>
  )
}

// ── Logo SVG ────────────────────────────────────────────────────────
function LogoIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="7" fill="#0d2a1e"/>
      <rect x="1" y="1" width="26" height="26" rx="6" stroke="#6ee7b7" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="8" y="20" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="#6ee7b7">₹</text>
      <circle cx="21" cy="9" r="2" fill="#6ee7b7"/>
      <line x1="17" y1="14" x2="25" y2="14" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="21" cy="19" r="2" fill="#6ee7b7"/>
    </svg>
  )
}

// ── Theme Toggle ────────────────────────────────────────────────────
// [L62] useState — toggling dark/light
// [L69] useContext — reads ThemeContext via useTheme()
function ThemeToggle() {
  const { dark, toggle } = useTheme()  // [L69] consuming context via custom hook
  return (
    <button
      className="theme-toggle"
      onClick={toggle}   // [L67] event handler
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {dark ? '☀️' : '🌙'}   {/* [L66] conditional rendering with ternary */}
    </button>
  )
}

// ── Install Button ──────────────────────────────────────────────────
// [L68] useEffect — listens for PWA install event (browser fires once)
// [L62] useState — tracks deferred prompt and install state
function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)  // [L62]
  const [showBtn, setShowBtn] = useState(false)
  const [installed, setInstalled] = useState(false)

  // [L68] useEffect with cleanup — addEventListener + return cleanup fn
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBtn(true)
    }
    window.addEventListener('beforeinstallprompt', handler)  // [L53] addEventListener
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalled(true)
    return () => window.removeEventListener('beforeinstallprompt', handler)  // [L68] cleanup
  }, [])  // [L68] empty deps = run once on mount

  // [L56] Async/Await — awaiting native browser prompt
  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice  // [L56] await promise
    if (outcome === 'accepted') { setInstalled(true); setShowBtn(false) }
    setDeferredPrompt(null)
  }

  if (installed) return <span className="install-btn" style={{ cursor: 'default', opacity: 0.6 }}>✓ Installed</span>
  if (!showBtn) return (
    <button className="install-btn" onClick={() => alert('Browser menu → "Add to Home Screen"')} title="Install as App">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M8 10l-3-3M8 10l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M1 11v3h14v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      Install App
    </button>
  )
  return (
    <button className="install-btn" onClick={handleInstall}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1v9M8 10l-3-3M8 10l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M1 11v3h14v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      Install App
    </button>
  )
}

// ── Navbar ──────────────────────────────────────────────────────────
// [L70] NavLink — React Router, adds .active class automatically
// [L61] Component composition — Navbar uses LogoIcon, ThemeToggle, InstallButton
export function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__logo">
          <img src="/favicon.svg" alt="logo" style={{ height: 50 }} />
          <span className="nav__logo-text">Split<span>Karo</span></span>
        </NavLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="nav__links">
            {/* [L70] NavLink with className function — isActive prop for active styling */}
            <NavLink to="/" end className={({ isActive }) => 'nav__link' + (isActive ? ' active' : '')}>Home</NavLink>
            <NavLink to="/groups" className={({ isActive }) => 'nav__link' + (isActive ? ' active' : '')}>Groups</NavLink>
          </div>
          <ThemeToggle />   {/* [L69] Theme toggle reads ThemeContext */}
          <InstallButton />
        </div>
      </div>
    </nav>
  )
}
