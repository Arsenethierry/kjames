import { useRef, useState } from "react"

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FanNote {
  id: number
  name: string
  message: string
  timestamp: string
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
}

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_NOTES: FanNote[] = [
  {
    id: 0,
    name: "Amina K.",
    message:
      "King James changed my life. 20 years of pure greatness — nothing compares.",
    timestamp: "11:24 PM",
  },
  {
    id: 1,
    name: "Patrick R.",
    message:
      "The voice of Rwanda. No artist has come close. See you August 1st, BK Arena!",
    timestamp: "11:19 PM",
  },
  {
    id: 2,
    name: "Grace M.",
    message:
      "From 2006 to 2026 — the evolution has been unreal. A true legend in our time.",
    timestamp: "11:15 PM",
  },
  {
    id: 3,
    name: "Claude B.",
    message:
      "BK Arena won't be ready for this energy. 20 years strong and still ascending!",
    timestamp: "11:08 PM",
  },
  {
    id: 4,
    name: "Diane N.",
    message:
      "Every album has been a chapter of my life. August 1 is going to be historic.",
    timestamp: "10:55 PM",
  },
]

const CONFETTI_COLORS = [
  "#D4AF37",
  "#ff6b9d",
  "#ff4444",
  "#ffffff",
  "#ffd700",
  "#9b59b6",
  "#3498db",
]

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InteractiveTerminal() {
  const [loveCount, setLoveCount] = useState(24_750)
  const [notes, setNotes] = useState<FanNote[]>(SEED_NOTES)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [particles, setParticles] = useState<Particle[]>([])
  const [heartScale, setHeartScale] = useState(1)

  const nextId = useRef(SEED_NOTES.length)
  const particleId = useRef(0)

  // ── Heart click ────────────────────────────────────────────────────────
  function handleHeart() {
    setLoveCount((n) => n + 1)
    setHeartScale(1.35)
    setTimeout(() => setHeartScale(1), 500)

    const burst: Particle[] = Array.from({ length: 20 }, () => ({
      id: particleId.current++,
      x: 50 + (Math.random() - 0.5) * 16,
      y: 50 + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 14 + 5),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 7,
    }))

    setParticles((prev) => [...prev, ...burst])
    setTimeout(() => {
      const ids = new Set(burst.map((p) => p.id))
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)))
    }, 1300)
  }

  // ── Form submit ────────────────────────────────────────────────────────
  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimName = name.trim()
    const trimMsg = message.trim()
    if (!trimName || !trimMsg) return

    const note: FanNote = {
      id: nextId.current++,
      name: trimName,
      message: trimMsg,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
    setNotes((prev) => [note, ...prev])
    setName("")
    setMessage("")
  }

  // ── Style helpers ──────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.5rem",
    padding: "0.8rem 1rem",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    fontFamily: "inherit",
    transition: "border-color 0.25s",
    boxSizing: "border-box",
  }

  const focusStyle = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.55)")

  const blurStyle = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        color: "#fff",
        fontFamily: "'Geist Variable', 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4rem 1.5rem 5rem",
      }}
    >
      {/* ── Top gold rule ──────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
          marginBottom: "4rem",
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{ textAlign: "center", marginBottom: "3.5rem" }}>

        {/* King James portrait — circular gold-ringed frame */}
        <div
          style={{
            display: "inline-block",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          {/* Outer glow ring */}
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              background:
                "conic-gradient(#D4AF37 0deg, #f0c040 90deg, #D4AF37 180deg, #8B6914 270deg, #D4AF37 360deg)",
              zIndex: 0,
            }}
          />
          {/* Inner dark border */}
          <div
            style={{
              position: "absolute",
              inset: "3px",
              borderRadius: "50%",
              background: "#030308",
              zIndex: 1,
            }}
          />
          <img
            src="/images/King%20James%20portrait.jpg"
            alt="King James"
            style={{
              display: "block",
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center top",
              position: "relative",
              zIndex: 2,
              filter: "contrast(1.08) saturate(1.1)",
            }}
          />
          {/* Gold shimmer sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, transparent 60%)",
              zIndex: 3,
              pointerEvents: "none",
            }}
          />
        </div>

        <p
          style={{
            letterSpacing: "0.5em",
            fontSize: "0.65rem",
            color: "#D4AF37",
            textTransform: "uppercase",
            marginBottom: "1rem",
            opacity: 0.9,
          }}
        >
          You&apos;ve arrived
        </p>

        <h1
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 900,
            letterSpacing: "0.06em",
            background:
              "linear-gradient(135deg, #D4AF37 0%, #fffbe0 45%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.05,
            marginBottom: "0.8rem",
          }}
        >
          BK ARENA 2026
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.92rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          August 1 · 20 Years of Greatness
        </p>

        <a
          href="https://bkarena.rw"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "0.8rem 2.2rem",
            background: "linear-gradient(135deg, #D4AF37, #f0c040)",
            color: "#000",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            borderRadius: "2rem",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 24px rgba(212,175,55,0.25)",
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.transform = "scale(1.05)"
            ;(e.currentTarget as HTMLElement).style.boxShadow =
              "0 6px 36px rgba(212,175,55,0.5)"
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
            ;(e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 24px rgba(212,175,55,0.25)"
          }}
        >
          Get Tickets →
        </a>
      </header>

      {/* ── Two-column grid ─────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.8rem",
          maxWidth: "1100px",
          width: "100%",
        }}
      >
        {/* ══ LEFT COL ══════════════════════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>

          {/* ── Global Love Pulse ──────────────────────────────────── */}
          <section
            style={{
              border: "1px solid rgba(212,175,55,0.18)",
              borderRadius: "1rem",
              padding: "2.5rem 2rem",
              background: "rgba(212,175,55,0.025)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle background glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 50% 60%, rgba(212,175,55,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "#D4AF37",
                marginBottom: "1.8rem",
                position: "relative",
              }}
            >
              Global Love Pulse
            </p>

            {/* Heart button + particles ────────────────────────────── */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: "0.5rem",
              }}
            >
              <button
                onClick={handleHeart}
                aria-label="Send love to King James"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "5.5rem",
                  lineHeight: 1,
                  display: "block",
                  transition: "transform 0.18s, filter 0.18s",
                  transform: `scale(${heartScale})`,
                  filter:
                    heartScale > 1
                      ? "drop-shadow(0 0 24px #ff6b9d) drop-shadow(0 0 48px rgba(255,100,150,0.4))"
                      : "drop-shadow(0 0 8px rgba(255,100,150,0.3))",
                  userSelect: "none",
                }}
              >
                ♥
              </button>

              {/* CSS particle confetti */}
              {particles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    borderRadius: "50%",
                    background: p.color,
                    pointerEvents: "none",
                    animation: "terminalParticle 1.3s ease-out forwards",
                    "--vx": `${p.vx}px`,
                    "--vy": `${p.vy}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>

            <p
              style={{
                fontSize: "2.8rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                position: "relative",
              }}
            >
              {loveCount.toLocaleString()}
            </p>
            <p
              style={{
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginTop: "0.4rem",
                position: "relative",
              }}
            >
              love pulses sent
            </p>
          </section>

          {/* ── Fan Message Form ───────────────────────────────────── */}
          <section
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1rem",
              padding: "2rem",
              background: "rgba(255,255,255,0.018)",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "1.6rem",
              }}
            >
              Leave a Message
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <textarea
                placeholder="Share your message for King James…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={240}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <button
                type="submit"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))",
                  border: "1px solid rgba(212,175,55,0.28)",
                  borderRadius: "0.5rem",
                  padding: "0.8rem",
                  color: "#D4AF37",
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.22s, border-color 0.22s",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background =
                    "rgba(212,175,55,0.18)"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(212,175,55,0.55)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background =
                    "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))"
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(212,175,55,0.28)"
                }}
              >
                Send Message →
              </button>
            </form>
          </section>
        </div>

        {/* ══ RIGHT COL: Fan Notes Feed ══════════════════════════════ */}
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1rem",
            padding: "2rem",
            background: "rgba(255,255,255,0.018)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.6rem",
            }}
          >
            <p
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Fan Notes
            </p>
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#D4AF37",
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.2)",
                padding: "0.2rem 0.6rem",
                borderRadius: "1rem",
              }}
            >
              ● Live
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              overflowY: "auto",
              maxHeight: "520px",
              paddingRight: "0.25rem",
            }}
          >
            {notes.map((note, i) => (
              <article
                key={note.id}
                style={{
                  borderLeft: "2px solid rgba(212,175,55,0.32)",
                  paddingLeft: "1rem",
                  paddingTop: "0.2rem",
                  paddingBottom: "0.2rem",
                  animation: i === 0 ? "terminalFadeIn 0.4s ease" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.35rem",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#D4AF37",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {note.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: "rgba(255,255,255,0.28)",
                      flexShrink: 0,
                    }}
                  >
                    {note.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.55,
                  }}
                >
                  {note.message}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ── Bottom gold rule ────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
          marginTop: "4rem",
        }}
      />

      <p
        style={{
          marginTop: "2rem",
          fontSize: "0.62rem",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        King James · 20 Years of Greatness · BK Arena · August 1, 2026
      </p>

      {/* ── Keyframes ────────────────────────────────────────────────── */}
      <style>{`
        @keyframes terminalParticle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--vx,0), var(--vy,-40px)) scale(0.1); opacity: 0; }
        }
        @keyframes terminalFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
