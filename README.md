# 💸 SplitKaro — Smart Expense Splitter

> Split expenses, not friendships.

A modern, no-login web app to split group expenses with ease.
Track spending, minimize transactions, and settle instantly — all in your browser.

🔗 **Live Demo:** https://splitkro.vercel.app/

---

## ✨ Features

* ⚡ **No Login Required** — instant usage
* 🧮 **Smart Debt Simplification Algorithm**
* 📊 **Real-time Balance Tracking**
* 📱 **WhatsApp-ready Settlement Sharing**
* 💾 **LocalStorage Persistence (no backend)**
* 🌗 **Dark / Light Mode**
* 📲 **Installable PWA (Add to Home Screen)**

---

## 🖼️ Preview

<img width="1919" height="902" alt="Screenshot 2026-04-19 221406" src="https://github.com/user-attachments/assets/2eb96fb9-5e9c-456c-ab6d-6b6e9619410e" />
<br>
<img width="1918" height="910" alt="image" src="https://github.com/user-attachments/assets/e0456127-3105-4720-bf3d-fe9abe64f471" />



---

## 🛠️ Tech Stack

| Category    | Tech                     |
| ----------- | ------------------------ |
| Frontend    | React 18 + Vite          |
| Routing     | React Router v6          |
| State       | Context API + useReducer |
| Forms       | React Hook Form          |
| Performance | useMemo                  |
| Storage     | LocalStorage             |
| Styling     | Custom CSS Design System |

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Open 👉 http://localhost:5173

---

## 📦 Build

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── store/        # Global state (Context + Reducer)
├── utils/        # Core logic (Debt algorithm)
├── hooks/        # Custom hooks
├── components/   # Reusable UI components
├── pages/        # Route-based pages
├── App.jsx       # Routing setup
├── main.jsx      # Entry point
└── index.css     # Design system
```

---

## 🧠 Core Algorithm 

📍 `src/utils/debtAlgorithm.js`

### Strategy:

1. Compute net balance
   → `net = paid - owed`

2. Split users:

   * Creditors (positive)
   * Debtors (negative)

3. Greedy matching:

   * Largest debtor ↔ largest creditor
   * Transfer minimum value

4. Repeat until all balances are zero

### Complexity:

* ⏱ Time: **O(n log n)**
* 🧠 Space: **O(n)**

✅ Guarantees **minimum number of transactions**

---

## 💡 Why This Project Stands Out

* Zero-auth, frictionless UX
* Efficient greedy algorithm (real-world optimization problem)
* Clean architecture (separation of logic & UI)
* Fully client-side (privacy-first design)
* PWA-ready (installable like an app)

---

## 🚀 Future Enhancements

* 🔐 Authentication (Google / Email)
* ☁️ Cloud sync (Firebase / Supabase)
* 💳 UPI / payment integration
* 📊 Analytics dashboard

---

## ⭐ Support

If you like this project, give it a ⭐ — it helps a lot!
