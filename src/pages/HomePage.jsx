import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "⚡",
    title: "No login needed",
    body: "Create a group instantly — no accounts, no friction.",
  },
  {
    icon: "🧮",
    title: "Fewest payments",
    body: "Smart algorithm finds the minimum number of transactions to settle all debts.",
  },
  {
    icon: "📱",
    title: "WhatsApp ready",
    body: "One tap to copy the full settlement summary into your group chat.",
  },
  {
    icon: "🔒",
    title: "All local",
    body: "Everything lives in your browser. No server, no tracking.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create a group",
    body: "Name your trip and add all the members.",
  },
  {
    num: "02",
    title: "Log expenses",
    body: "Add who paid, how much, and who it was split among.",
  },
  {
    num: "03",
    title: "Settle up",
    body: "See the minimum payments needed. Copy and share instantly.",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell hero-grid" style={{ background: "var(--bg)" }}>
      {/* ── Hero ── */}
      <section
        style={{
          padding: "5rem 1.25rem 4rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 400,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container container--narrow"
          style={{ margin: "0 auto", position: "relative" }}
        >
          <div
            className="badge badge-green"
            style={{ margin: "0 auto 1.5rem", display: "inline-flex" }}
          >
            ✦ No login required
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 62px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "1.25rem",
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            Split expenses,
            <br />
            <span style={{ color: "var(--accent)" }}>not friendships.</span>
          </h1>

          <p
            style={{
              fontSize: 15,
              color: "var(--ink-soft)",
              maxWidth: 400,
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            The no-nonsense group expense splitter for Indian friend groups.
            Track, split, and settle — right in your browser.
          </p>

          <div className="flex gap-3 wrap" style={{ justifyContent: "center" }}>
            <Link to="/groups/new" className="btn btn-primary btn-lg">
              Start a Group →
            </Link>
            <Link to="/groups" className="btn btn-ghost btn-lg">
              View Groups
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tags strip ── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "0.85rem 1.25rem",
        }}
      >
        <div className="container" style={{ margin: "0 auto" }}>
          <div className="flex gap-6 wrap" style={{ justifyContent: "center" }}>
            {[
              "Goa trips",
              "Office lunches",
              "Flat expenses",
              "Road trips",
              "Movie nights",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  color: "var(--ink-faint)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section style={{ padding: "4rem 1.25rem" }}>
        <div className="container" style={{ margin: "0 auto" }}>
          <div className="page-header__eyebrow mb-4">How it works</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 48,
                    fontWeight: 700,
                    color: "var(--accent)",
                    opacity: 0.08,
                    lineHeight: 1,
                    position: "absolute",
                    top: 8,
                    right: 12,
                  }}
                >
                  {s.num}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--accent)",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  step {s.num}
                </div>

                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: "var(--ink)",
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    lineHeight: 1.6,
                  }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        style={{
          padding: "2rem 1.25rem 4rem",
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="container" style={{ margin: "0 auto" }}>
          <div className="page-header__eyebrow mb-4">Features</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card"
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>
                  {f.icon}
                </span>

                <div>
                  <h4
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      marginBottom: 4,
                      color: "var(--ink)",
                    }}
                  >
                    {f.title}
                  </h4>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ink-soft)",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer (UPDATED RESPONSIVE) ── */}
      <footer
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          padding: "1.5rem 1.25rem",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Logo */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--accent)",
              fontSize: 15,
            }}
          >
            ₹ SplitKaro
          </span>

          {/* Tagline */}
          <span
            style={{
              fontSize: 12,
              color: "var(--ink-faint)",
              textAlign: "center",
              flex: "1 1 200px",
            }}
          >
            No login · No server · All local
          </span>

          {/* Credits */}
          <span
            style={{
              fontSize: 12,
              color: "var(--ink-soft)",
              textAlign: "right",
            }}
          >
            Made with ❤️ by Samar ·
            <a
              href="https://github.com/SamarjeetRay"
              target="_blank"
              style={{
                marginLeft: 6,
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              GitHub
            </a>
            ·
            <a
              href="https://www.linkedin.com/in/samarjeetray/"
              target="_blank"
              style={{
                marginLeft: 6,
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              LinkedIn
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
