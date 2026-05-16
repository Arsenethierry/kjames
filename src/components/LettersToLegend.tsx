import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

interface Letter {
  id: number
  name: string
  city: string
  body: string
  timestamp: string
}

const SEED: Letter[] = [
  {
    id: 0,
    name: "Claudine M.",
    city: "Kigali",
    body: "King James, you were the soundtrack of my entire childhood. Every album was a chapter of my life I will never forget. August 1 is not just a concert — it is 20 years of gratitude made real.",
    timestamp: "May 2026",
  },
  {
    id: 1,
    name: "Olivier R.",
    city: "Paris",
    body: "Growing up in the diaspora, your music was the piece of home I always carried. Thank you for being the voice that reminded us who we are, no matter where we were in the world.",
    timestamp: "May 2026",
  },
  {
    id: 2,
    name: "Diane N.",
    city: "Montreal",
    body: "I have played your music at every important moment of my life — celebrations, heartbreak, late nights. You are woven into who I am. This concert is going to break me beautifully.",
    timestamp: "May 2026",
  },
]

let nextId = SEED.length

export default function LettersToLegend() {
  const [letters, setLetters] = useState<Letter[]>(() => lsGet("kj_letters", SEED))
  const [name, setName] = useState("")
  const [city, setCity] = useState("")
  const [body, setBody] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !body.trim()) return
    const letter: Letter = {
      id: nextId++,
      name: name.trim(),
      city: city.trim(),
      body: body.trim(),
      timestamp: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }
    const next = [letter, ...letters]
    setLetters(next)
    lsSet("kj_letters", next)
    setName(""); setCity(""); setBody("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.25s",
    boxSizing: "border-box" as const,
    width: "100%",
  }

  return (
    <div style={{ maxWidth: "660px", margin: "0 auto" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "0.6rem", display: "block" }}>
        Letters to the Legend
      </span>
      <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        Write to King James
      </h2>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
        Tell him what 20 years has meant to you. Every letter here will be compiled into a digital book and delivered to King James before August 1st.
      </p>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: "rgba(212,175,55,0.08)",
        border: "1px solid rgba(212,175,55,0.2)",
        borderRadius: "2rem",
        padding: "0.3rem 0.9rem",
        marginBottom: "2rem",
      }}>
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4AF37" }} />
        <span style={{ fontSize: "0.62rem", color: "#D4AF37", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {letters.length} letters compiled
        </span>
      </div>

      {/* Form */}
      <form onSubmit={submit} style={{
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "1rem",
        padding: "1.8rem",
        background: "rgba(255,255,255,0.018)",
        marginBottom: "2.5rem",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginBottom: "0.7rem" }}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <input
            placeholder="City, Country"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={50}
            style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>
        <textarea
          placeholder="Dear King James…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={600}
          rows={5}
          style={{ ...inputStyle, resize: "vertical" as const }}
          onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
          onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.7rem" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>{body.length}/600</span>
          <button
            type="submit"
            style={{
              padding: "0.7rem 1.8rem",
              background: submitted ? "rgba(34,197,94,0.12)" : "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))",
              border: submitted ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(212,175,55,0.3)",
              borderRadius: "0.5rem",
              color: submitted ? "#22c55e" : "#D4AF37",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {submitted ? "Submitted ✓" : "Send Letter →"}
          </button>
        </div>
      </form>

      {/* Letters feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {letters.map((letter) => {
          const isOpen = expanded === letter.id
          const preview = letter.body.length > 140 ? letter.body.slice(0, 140) + "…" : letter.body

          return (
            <article
              key={letter.id}
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "0.8rem",
                padding: "1.4rem",
                background: "rgba(255,255,255,0.018)",
                cursor: letter.body.length > 140 ? "pointer" : "default",
              }}
              onClick={() => letter.body.length > 140 && setExpanded(isOpen ? null : letter.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem", gap: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#D4AF37" }}>{letter.name}</span>
                  {letter.city && (
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "0.5rem" }}>{letter.city}</span>
                  )}
                </div>
                <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.22)", flexShrink: 0 }}>{letter.timestamp}</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.65, fontStyle: "italic" }}>
                &ldquo;{isOpen ? letter.body : preview}&rdquo;
              </p>
              {letter.body.length > 140 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(isOpen ? null : letter.id) }}
                  style={{
                    marginTop: "0.6rem",
                    background: "none",
                    border: "none",
                    color: "rgba(212,175,55,0.6)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  {isOpen ? "Show less" : "Read full letter"}
                </button>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
