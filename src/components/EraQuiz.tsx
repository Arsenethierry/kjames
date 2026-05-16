import { useState } from "react"

// ─── ERA DATA ─────────────────────────────────────────────────────────────────
const ERAS = [
  {
    index: 0,
    year: "2006",
    title: "THE GENESIS",
    accentHex: "#1a4abf",
    tagline: "You were there at the very beginning.",
    description: "Pure. Raw. Unstoppable from day one. You carry the original fire.",
  },
  {
    index: 1,
    year: "2010",
    title: "RISING FLAMES",
    accentHex: "#f59e0b",
    tagline: "You rise like no force can stop you.",
    description: "Momentum. Hunger. The world was about to find out.",
  },
  {
    index: 2,
    year: "2014",
    title: "THE CONTINENT BOWED",
    accentHex: "#dc2626",
    tagline: "You make entire rooms go silent.",
    description: "Command. Power. When you move, everything moves with you.",
  },
  {
    index: 3,
    year: "2018",
    title: "ELECTRIC CROWN",
    accentHex: "#0d9488",
    tagline: "You are charged with something electric.",
    description: "Reinvention. Vision. You wear your crown and keep evolving.",
  },
  {
    index: 4,
    year: "2022",
    title: "LEGACY FORGED",
    accentHex: "#7c3aed",
    tagline: "You are the living proof of what endures.",
    description: "Mastery. Depth. Twenty years was always just the beginning.",
  },
]

// ─── QUIZ QUESTIONS ───────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: "You walk into a room. What happens?",
    options: [
      { text: "People notice something changed, but can't say what", era: 0 },
      { text: "The energy immediately goes up", era: 1 },
      { text: "The whole room turns to look at you", era: 2 },
      { text: "You light the place up without trying", era: 3 },
      { text: "Everyone gets quiet — respect walking in", era: 4 },
    ],
  },
  {
    q: "Your perfect 2am is…",
    options: [
      { text: "Creating something from nothing, alone with the craft", era: 0 },
      { text: "On the dancefloor, completely unstoppable", era: 1 },
      { text: "Center of the concert — every word memorized", era: 2 },
      { text: "Alive, lit, music taking your entire body over", era: 3 },
      { text: "Deep talk, old vinyl, legacy conversations", era: 4 },
    ],
  },
  {
    q: "Which King James era lives in your chest?",
    options: [
      { text: "The raw, humble first chapter — pure beginnings", era: 0 },
      { text: "The ascent — watching him become unstoppable", era: 1 },
      { text: "The peak — when the whole continent bowed", era: 2 },
      { text: "The reinvention — electric and forward", era: 3 },
      { text: "The legacy — 20 years and still ascending", era: 4 },
    ],
  },
  {
    q: "Your role in the King James fandom is…",
    options: [
      { text: "The OG who was there before anyone else", era: 0 },
      { text: "The one who brought everyone to the shows", era: 1 },
      { text: "The one who knows every single word", era: 2 },
      { text: "The creator — covers, edits, fan content", era: 3 },
      { text: "The keeper of his full 20-year legacy", era: 4 },
    ],
  },
  {
    q: "One word that defines you:",
    options: [
      { text: "Origins", era: 0 },
      { text: "Ascent", era: 1 },
      { text: "Command", era: 2 },
      { text: "Current", era: 3 },
      { text: "Legend", era: 4 },
    ],
  },
]

// ─── CARD GENERATOR ───────────────────────────────────────────────────────────
function generateCard(fanName: string, era: (typeof ERAS)[0]): string {
  const W = 540
  const H = 960
  const c = document.createElement("canvas")
  c.width = W
  c.height = H
  const ctx = c.getContext("2d")!

  // Background
  ctx.fillStyle = "#030308"
  ctx.fillRect(0, 0, W, H)

  // Era radial glow
  const grd = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.85)
  grd.addColorStop(0, era.accentHex + "55")
  grd.addColorStop(0.55, era.accentHex + "18")
  grd.addColorStop(1, "transparent")
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  // Gold top border
  ctx.fillStyle = "#D4AF37"
  ctx.fillRect(0, 0, W, 3)
  ctx.fillRect(0, H - 3, W, 3)

  // Thin side lines
  ctx.globalAlpha = 0.25
  ctx.fillStyle = "#D4AF37"
  ctx.fillRect(0, 0, 1.5, H)
  ctx.fillRect(W - 1.5, 0, 1.5, H)
  ctx.globalAlpha = 1

  // ── KING JAMES at top ──────────────────────────────────────────────────
  ctx.textAlign = "center"
  ctx.font = "bold 20px Arial"
  ctx.fillStyle = "#D4AF37"
  ctx.fillText("K I N G   J A M E S", W / 2, 72)

  ctx.font = "400 11px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.38)"
  ctx.fillText("2 0   Y E A R S   O F   G R E A T N E S S", W / 2, 98)

  // Era-colored divider
  ctx.strokeStyle = era.accentHex
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(80, 118)
  ctx.lineTo(W - 80, 118)
  ctx.stroke()

  // ── YOUR ERA label ─────────────────────────────────────────────────────
  ctx.font = "400 11px Arial"
  ctx.fillStyle = era.accentHex
  ctx.fillText("Y O U R   E R A", W / 2, 180)

  // ── Era title (large) ──────────────────────────────────────────────────
  const words = era.title.split(" ")
  ctx.fillStyle = "#ffffff"

  if (words.length === 1) {
    ctx.font = "bold 70px Arial"
    ctx.fillText(era.title, W / 2, 300)
  } else if (words.length === 2) {
    ctx.font = "bold 58px Arial"
    ctx.fillText(words[0], W / 2, 270)
    ctx.fillText(words[1], W / 2, 338)
  } else {
    ctx.font = "bold 44px Arial"
    words.forEach((w, i) => ctx.fillText(w, W / 2, 252 + i * 60))
  }

  // Era year
  ctx.font = "400 17px Arial"
  ctx.fillStyle = era.accentHex
  ctx.fillText(era.year, W / 2, words.length > 2 ? 440 : 400)

  // Tagline
  ctx.font = "italic 15px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.52)"
  ctx.fillText(era.tagline, W / 2, words.length > 2 ? 480 : 448)

  // ── Fan name section ───────────────────────────────────────────────────
  ctx.globalAlpha = 0.15
  ctx.fillStyle = "#D4AF37"
  ctx.fillRect(60, 570, W - 120, 1)
  ctx.globalAlpha = 1

  ctx.font = "bold 30px Arial"
  ctx.fillStyle = "#ffffff"
  const displayName = fanName.length > 22 ? fanName.slice(0, 22) + "…" : fanName
  ctx.fillText(displayName.toUpperCase(), W / 2, 636)

  ctx.font = "400 12px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.38)"
  ctx.fillText("A TRUE KING JAMES FAN", W / 2, 662)

  // ── Bottom section ─────────────────────────────────────────────────────
  ctx.globalAlpha = 0.15
  ctx.fillStyle = "#D4AF37"
  ctx.fillRect(60, 790, W - 120, 1)
  ctx.globalAlpha = 1

  ctx.font = "600 13px Arial"
  ctx.fillStyle = "#D4AF37"
  ctx.fillText("BK ARENA  ·  AUGUST 1, 2026", W / 2, 830)

  ctx.font = "400 11px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.3)"
  ctx.fillText("king-james-20years.com", W / 2, 858)

  ctx.font = "400 10px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.18)"
  ctx.fillText("built by @arsene", W / 2, 928)

  return c.toDataURL("image/png")
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
type Stage = "intro" | "name" | "quiz" | "result"

export default function EraQuiz() {
  const [stage, setStage] = useState<Stage>("intro")
  const [fanName, setFanName] = useState("")
  const [step, setStep] = useState(0)
  const [scores, setScores] = useState([0, 0, 0, 0, 0])
  const [resultEra, setResultEra] = useState<(typeof ERAS)[0] | null>(null)
  const [cardUrl, setCardUrl] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  function pickAnswer(eraIdx: number) {
    const next = scores.map((s, i) => (i === eraIdx ? s + 1 : s))
    setScores(next)
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1)
    } else {
      const winner = next.indexOf(Math.max(...next))
      const era = ERAS[winner]
      setResultEra(era)
      const url = generateCard(fanName || "FAN", era)
      setCardUrl(url)
      setStage("result")
    }
  }

  function restart() {
    setStage("intro")
    setFanName("")
    setStep(0)
    setScores([0, 0, 0, 0, 0])
    setResultEra(null)
    setCardUrl(null)
    setDownloaded(false)
  }

  function download() {
    if (!cardUrl || !resultEra) return
    const a = document.createElement("a")
    a.href = cardUrl
    a.download = `king-james-era-${resultEra.year}.png`
    a.click()
    setDownloaded(true)
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "0.58rem",
    letterSpacing: "0.45em",
    textTransform: "uppercase",
    color: "#D4AF37",
    marginBottom: "1.5rem",
    display: "block",
  }

  const btnBase: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1.2rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.6rem",
    color: "rgba(255,255,255,0.78)",
    fontSize: "0.88rem",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "background 0.2s, border-color 0.2s, color 0.2s",
    lineHeight: 1.45,
  }

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto" }}>
        <span style={labelStyle}>Era DNA</span>
        <h2 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.1,
          marginBottom: "1rem",
        }}>
          Which King James Era<br />
          <span style={{ color: "#D4AF37" }}>Are You?</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "2.4rem" }}>
          5 questions. Your era assigned. Download a shareable card for Instagram Stories — and show Rwanda which era lives in your soul.
        </p>
        <button
          onClick={() => setStage("name")}
          style={{
            padding: "0.9rem 2.8rem",
            background: "linear-gradient(135deg, #D4AF37, #f0c040)",
            border: "none",
            borderRadius: "2rem",
            color: "#000",
            fontWeight: 800,
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Discover Your Era →
        </button>
      </div>
    )
  }

  // ── NAME INPUT ─────────────────────────────────────────────────────────
  if (stage === "name") {
    return (
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <span style={labelStyle}>Era DNA — Step 0 / 5</span>
        <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "2rem", lineHeight: 1.3 }}>
          What should we put on your card?
        </p>
        <input
          type="text"
          placeholder="Your name…"
          value={fanName}
          onChange={(e) => setFanName(e.target.value)}
          maxLength={30}
          style={{
            width: "100%",
            padding: "0.9rem 1.1rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "0.6rem",
            color: "#fff",
            fontSize: "1rem",
            fontFamily: "inherit",
            outline: "none",
            marginBottom: "1.2rem",
            boxSizing: "border-box",
          }}
          onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
          onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
          onKeyDown={(e) => e.key === "Enter" && fanName.trim() && setStage("quiz")}
        />
        <button
          onClick={() => setStage("quiz")}
          disabled={!fanName.trim()}
          style={{
            padding: "0.85rem 2.4rem",
            background: fanName.trim() ? "linear-gradient(135deg, #D4AF37, #f0c040)" : "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "2rem",
            color: fanName.trim() ? "#000" : "rgba(255,255,255,0.3)",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            cursor: fanName.trim() ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Start the Quiz →
        </button>
      </div>
    )
  }

  // ── QUIZ ───────────────────────────────────────────────────────────────
  if (stage === "quiz") {
    const q = QUESTIONS[step]
    const progress = ((step + 1) / QUESTIONS.length) * 100
    return (
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem" }}>
          <span style={{ ...labelStyle, marginBottom: 0 }}>Era DNA — Q{step + 1} / {QUESTIONS.length}</span>
          <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>
            {fanName || "Fan"}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: "2px", background: "rgba(255,255,255,0.08)", borderRadius: "1px", marginBottom: "2rem" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(to right, #D4AF37, #f0c040)",
            borderRadius: "1px",
            transition: "width 0.4s ease",
          }} />
        </div>

        <p style={{ fontSize: "clamp(1.05rem, 3vw, 1.3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.4, marginBottom: "1.8rem" }}>
          {q.q}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pickAnswer(opt.era)}
              style={btnBase}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "rgba(212,175,55,0.1)"
                el.style.borderColor = "rgba(212,175,55,0.4)"
                el.style.color = "#fff"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = "rgba(255,255,255,0.04)"
                el.style.borderColor = "rgba(255,255,255,0.1)"
                el.style.color = "rgba(255,255,255,0.78)"
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── RESULT ─────────────────────────────────────────────────────────────
  if (stage === "result" && resultEra) {
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
        <span style={labelStyle}>Your Era DNA</span>

        {/* Era reveal card */}
        <div style={{
          border: `1px solid ${resultEra.accentHex}55`,
          borderRadius: "1.2rem",
          padding: "2.5rem 2rem",
          background: `radial-gradient(circle at 50% 40%, ${resultEra.accentHex}18 0%, transparent 70%)`,
          marginBottom: "1.8rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            fontSize: "0.62rem",
            letterSpacing: "0.35em",
            color: resultEra.accentHex,
            textTransform: "uppercase",
            marginBottom: "0.8rem",
          }}>
            {resultEra.year}
          </div>
          <h2 style={{
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            marginBottom: "1rem",
          }}>
            {resultEra.title}
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", fontStyle: "italic", lineHeight: 1.6, marginBottom: "0.6rem" }}>
            {resultEra.tagline}
          </p>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
            {resultEra.description}
          </p>
        </div>

        {/* Card preview */}
        {cardUrl && (
          <div style={{ marginBottom: "1.8rem" }}>
            <img
              src={cardUrl}
              alt="Your era card"
              style={{
                width: "min(200px, 45vw)",
                borderRadius: "0.75rem",
                boxShadow: `0 12px 48px ${resultEra.accentHex}44`,
                display: "block",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={download}
            style={{
              padding: "0.85rem 2rem",
              background: downloaded
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #D4AF37, #f0c040)",
              border: downloaded ? "1px solid rgba(255,255,255,0.15)" : "none",
              borderRadius: "2rem",
              color: downloaded ? "rgba(255,255,255,0.5)" : "#000",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {downloaded ? "Downloaded ✓" : "Download Card →"}
          </button>
          <button
            onClick={restart}
            style={{
              padding: "0.85rem 1.6rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2rem",
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Retake Quiz
          </button>
        </div>

        <p style={{ marginTop: "1.4rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.28)", lineHeight: 1.6 }}>
          Post your card on Instagram Stories or TikTok.<br />
          Tag <strong style={{ color: "rgba(255,255,255,0.5)" }}>#KingJames20Years</strong>
        </p>
      </div>
    )
  }

  return null
}
