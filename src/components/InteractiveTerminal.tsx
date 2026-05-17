import { useEffect, useRef, useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

import CountdownTimer from "./CountdownTimer"
import LivePresence from "./LivePresence"
import EraQuiz from "./EraQuiz"
import SetlistVote from "./SetlistVote"
import FanMemories from "./FanMemories"
import LettersToLegend from "./LettersToLegend"
import ChallengeHub from "./ChallengeHub"
import FanArtGallery from "./FanArtGallery"
import FanGlobalMap from "./FanGlobalMap"
import ConcertCheckin from "./ConcertCheckin"

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

type TabId = "pulse" | "era" | "vote" | "memories" | "letters" | "challenge" | "gallery" | "map" | "aug1"

interface Tab {
  id: TabId
  label: string
  icon: string
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TABS: Tab[] = [
  { id: "pulse",     label: "Pulse",     icon: "♥" },
  { id: "era",       label: "Your Era",  icon: "◆" },
  { id: "vote",      label: "Vote",      icon: "◎" },
  { id: "memories",  label: "Memories",  icon: "◉" },
  { id: "letters",   label: "Letters",   icon: "✉" },
  { id: "challenge", label: "Challenge", icon: "↗" },
  { id: "gallery",   label: "Gallery",   icon: "▣" },
  { id: "map",       label: "World Map", icon: "◎" },
  { id: "aug1",      label: "Aug 1",     icon: "★" },
]

const SEED_NOTES: FanNote[] = [
  { id: 0, name: "Amina K.",   message: "King James changed my life. 20 years of pure greatness — nothing compares.", timestamp: "11:24 PM" },
  { id: 1, name: "Patrick R.", message: "The voice of Rwanda. No artist has come close. See you August 1st, BK Arena!", timestamp: "11:19 PM" },
  { id: 2, name: "Grace M.",   message: "From 2006 to 2026 — the evolution has been unreal. A true legend in our time.", timestamp: "11:15 PM" },
  { id: 3, name: "Claude B.",  message: "BK Arena won't be ready for this energy. 20 years strong and still ascending!", timestamp: "11:08 PM" },
  { id: 4, name: "Diane N.",   message: "Every album has been a chapter of my life. August 1 is going to be historic.", timestamp: "10:55 PM" },
]

const CONFETTI_COLORS = ["#D4AF37","#ff6b9d","#ff4444","#ffffff","#ffd700","#9b59b6","#3498db"]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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
  boxSizing: "border-box" as const,
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InteractiveTerminal() {
  const [activeTab, setActiveTab] = useState<TabId>("pulse")
  const [loveCount, setLoveCount] = useState(() => lsGet("kj_love_count", 24_750))
  const [notes, setNotes]         = useState<FanNote[]>(() => lsGet("kj_fan_notes", SEED_NOTES))
  const [name, setName]           = useState("")
  const [message, setMessage]     = useState("")
  const [particles, setParticles] = useState<Particle[]>([])
  const [heartScale, setHeartScale] = useState(1)
  const [dedicated, setDedicated] = useState(false)

  const nextId     = useRef(Math.max(...notes.map((n) => n.id)) + 1)
  const particleId = useRef(0)
  const footerRef  = useRef<HTMLParagraphElement>(null)

  // ── Start the virtual tour: fade out overlay → scroll to top ───────────
  function startTour() {
    const overlay = document.getElementById("terminal-overlay")
    if (!overlay) return
    window.dispatchEvent(new CustomEvent("tour-start"))
    overlay.style.transition = "opacity 0.85s ease"
    overlay.style.opacity = "0"
    overlay.classList.remove("is-active")
    setTimeout(() => {
      overlay.style.transition = ""
      window.scrollTo({ top: 0 })
    }, 900)
  }

  // ── Auto-start tour when user scrolls to the bottom of the fan hub ─────
  useEffect(() => {
    const el = footerRef.current
    const overlay = document.getElementById("terminal-overlay")
    if (!el || !overlay) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        setTimeout(() => startTour(), 900)
      },
      { root: overlay, threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Heart click ────────────────────────────────────────────────────────
  function handleHeart() {
    const next = loveCount + 1
    setLoveCount(next)
    lsSet("kj_love_count", next)
    setHeartScale(1.35)
    setTimeout(() => setHeartScale(1), 500)

    const burst: Particle[] = Array.from({ length: 20 }, () => ({
      id: particleId.current++,
      x:  50 + (Math.random() - 0.5) * 16,
      y:  50 + (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 14 + 5),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 7,
    }))
    setParticles((p) => [...p, ...burst])
    setTimeout(() => {
      const ids = new Set(burst.map((p) => p.id))
      setParticles((p) => p.filter((x) => !ids.has(x.id)))
    }, 1300)
  }

  // ── Message submit + dedication spotlight ──────────────────────────────
  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimName = name.trim()
    const trimMsg  = message.trim()
    if (!trimName || !trimMsg) return

    const note: FanNote = {
      id: nextId.current++,
      name: trimName,
      message: trimMsg,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
    }
    const next = [note, ...notes]
    setNotes(next)
    lsSet("kj_fan_notes", next)
    setName("")
    setMessage("")

    // Fire dedication spotlight in the 3D arena
    window.dispatchEvent(new CustomEvent("fan-dedication", { detail: { name: trimName, message: trimMsg } }))
    setDedicated(true)
    setTimeout(() => setDedicated(false), 6000)
  }

  // ── Tab nav ────────────────────────────────────────────────────────────
  function TabNav() {
    return (
      <div className="tab-scroll-hide" style={{
        display: "flex",
        gap: "0.4rem",
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        marginBottom: "2.5rem",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "1rem",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        paddingRight: "1rem",
      } as React.CSSProperties}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.45rem 1rem",
                background: active ? "rgba(212,175,55,0.14)" : "transparent",
                border: active ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "2rem",
                color: active ? "#D4AF37" : "rgba(255,255,255,0.38)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.18s",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (active) return
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(212,175,55,0.25)"
                el.style.color = "rgba(255,255,255,0.6)"
              }}
              onMouseLeave={(e) => {
                if (active) return
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "rgba(255,255,255,0.07)"
                el.style.color = "rgba(255,255,255,0.38)"
              }}
            >
              <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </div>
    )
  }

  // ── PULSE TAB content ──────────────────────────────────────────────────
  function PulseTab() {
    const focusBorder = (e: React.FocusEvent<HTMLElement>) =>
      ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.55)")
    const blurBorder  = (e: React.FocusEvent<HTMLElement>) =>
      ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")

    return (
      <div>
        {/* Dedication spotlight notification */}
        {dedicated && (
          <div style={{
            background: "rgba(212,175,55,0.08)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "0.7rem",
            padding: "0.85rem 1.2rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            animation: "terminalFadeIn 0.4s ease",
          }}>
            <span style={{ fontSize: "1.1rem" }}>✦</span>
            <p style={{ fontSize: "0.78rem", color: "#D4AF37", lineHeight: 1.4 }}>
              Your message is now projected on the BK Arena screen inside the 3D experience.
            </p>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.8rem",
        }}>
          {/* LEFT: Love pulse + message form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>

            {/* Love Pulse */}
            <section style={{
              border: "1px solid rgba(212,175,55,0.18)",
              borderRadius: "1rem",
              padding: "2.5rem 2rem",
              background: "rgba(212,175,55,0.025)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 50% 60%, rgba(212,175,55,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "1.8rem", position: "relative" }}>
                Global Love Pulse
              </p>
              <div style={{ position: "relative", display: "inline-block", marginBottom: "0.5rem" }}>
                <button
                  onClick={handleHeart}
                  aria-label="Send love to King James"
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "5.5rem", lineHeight: 1, display: "block",
                    transition: "transform 0.18s, filter 0.18s",
                    transform: `scale(${heartScale})`,
                    filter: heartScale > 1
                      ? "drop-shadow(0 0 24px #ff6b9d) drop-shadow(0 0 48px rgba(255,100,150,0.4))"
                      : "drop-shadow(0 0 8px rgba(255,100,150,0.3))",
                    userSelect: "none",
                  }}
                >♥</button>
                {particles.map((p) => (
                  <div key={p.id} style={{
                    position: "absolute",
                    left: `${p.x}%`, top: `${p.y}%`,
                    width: `${p.size}px`, height: `${p.size}px`,
                    borderRadius: "50%", background: p.color,
                    pointerEvents: "none",
                    animation: "terminalParticle 1.3s ease-out forwards",
                    "--vx": `${p.vx}px`, "--vy": `${p.vy}px`,
                  } as React.CSSProperties} />
                ))}
              </div>
              <p style={{ fontSize: "2.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, position: "relative" }}>
                {loveCount.toLocaleString()}
              </p>
              <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "0.4rem", position: "relative" }}>
                love pulses sent
              </p>
            </section>

            {/* Message form */}
            <section style={{
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1rem",
              padding: "2rem",
              background: "rgba(255,255,255,0.018)",
            }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "1.6rem" }}>
                Leave a Message
              </p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.32)", marginBottom: "1.2rem", lineHeight: 1.5 }}>
                Your message will be projected live on the BK Arena screen inside the 3D experience.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <input
                  type="text" placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  maxLength={50} style={inputStyle}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                <textarea
                  placeholder="Share your message for King James…"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  maxLength={240} rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={focusBorder} onBlur={blurBorder}
                />
                <button type="submit" style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))",
                  border: "1px solid rgba(212,175,55,0.28)",
                  borderRadius: "0.5rem", padding: "0.8rem",
                  color: "#D4AF37", fontSize: "0.72rem", letterSpacing: "0.22em",
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.22s, border-color 0.22s",
                }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.18)"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.55)"
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(212,175,55,0.14), rgba(212,175,55,0.04))"
                    ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.28)"
                  }}
                >
                  Send → Appear on Stage
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT: Fan notes feed */}
          <section style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "1rem",
            padding: "2rem",
            background: "rgba(255,255,255,0.018)",
            display: "flex",
            flexDirection: "column",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.6rem" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                Fan Notes
              </p>
              <span style={{
                fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase",
                color: "#D4AF37", background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.2)", padding: "0.2rem 0.6rem", borderRadius: "1rem",
              }}>● Live</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", overflowY: "auto", maxHeight: "520px", paddingRight: "0.25rem" }}>
              {notes.map((note, i) => (
                <article key={note.id} style={{
                  borderLeft: "2px solid rgba(212,175,55,0.32)",
                  paddingLeft: "1rem", paddingTop: "0.2rem", paddingBottom: "0.2rem",
                  animation: i === 0 ? "terminalFadeIn 0.4s ease" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#D4AF37", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {note.name}
                    </span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>{note.timestamp}</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.68)", lineHeight: 1.55 }}>{note.message}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      color: "#fff",
      fontFamily: "'Geist Variable', 'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 1.5rem) 5rem",
    }}>

      {/* ── Gold top rule ──────────────────────────────────────────────── */}
      <div style={{
        width: "100%", maxWidth: "1100px", height: "1px",
        background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
        marginBottom: "4rem",
      }} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ textAlign: "center", marginBottom: "3rem", width: "100%", maxWidth: "1100px" }}>
        {/* Portrait */}
        <div style={{ display: "inline-block", marginBottom: "2rem", position: "relative" }}>
          <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "conic-gradient(#D4AF37 0deg, #f0c040 90deg, #D4AF37 180deg, #8B6914 270deg, #D4AF37 360deg)", zIndex: 0 }} />
          <div style={{ position: "absolute", inset: "3px", borderRadius: "50%", background: "#030308", zIndex: 1 }} />
          <img
            src="/images/King%20James%20portrait.jpg"
            alt="King James"
            style={{ display: "block", width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", position: "relative", zIndex: 2, filter: "contrast(1.08) saturate(1.1)" }}
          />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, transparent 60%)", zIndex: 3, pointerEvents: "none" }} />
        </div>

        <p style={{ letterSpacing: "0.5em", fontSize: "0.65rem", color: "#D4AF37", textTransform: "uppercase", marginBottom: "1rem", opacity: 0.9 }}>
          King James · 20 Years of Greatness
        </p>

        <h1 style={{
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)", fontWeight: 900, letterSpacing: "0.06em",
          background: "linear-gradient(135deg, #D4AF37 0%, #fffbe0 45%, #D4AF37 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          lineHeight: 1.05, marginBottom: "0.8rem",
        }}>
          BK ARENA 2026
        </h1>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.92rem", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "1.6rem" }}>
          August 1 · 20 Years of Greatness
        </p>

        {/* CTA row: tickets + tour */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <a
            href="https://bkarena.rw"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block", padding: "0.8rem 2.2rem",
              background: "linear-gradient(135deg, #D4AF37, #f0c040)",
              color: "#000", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.2em",
              textTransform: "uppercase", borderRadius: "2rem", textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 24px rgba(212,175,55,0.25)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1.05)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 6px 36px rgba(212,175,55,0.5)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(212,175,55,0.25)"
            }}
          >
            Get Tickets →
          </a>

          <button
            onClick={startTour}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.8rem 2.2rem",
              background: "transparent",
              border: "1px solid rgba(212,175,55,0.45)",
              color: "#D4AF37", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.2em",
              textTransform: "uppercase", borderRadius: "2rem",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.1)"
              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.8)"
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1.05)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(212,175,55,0.25)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = "transparent"
              ;(e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.45)"
              ;(e.currentTarget as HTMLElement).style.transform = "scale(1)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>▶</span>
            Take a Tour
          </button>
        </div>
      </header>

      {/* ── Countdown + Presence row ────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: "1100px", marginBottom: "3rem" }}>
        <div style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "1.2rem",
          padding: "2.4rem 2rem",
          background: "rgba(255,255,255,0.018)",
          display: "flex",
          flexDirection: "column",
          gap: "1.6rem",
          alignItems: "center",
        }}>
          <CountdownTimer />
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.05)" }} />
          <LivePresence />
        </div>
      </div>

      {/* ── Tab navigation + content ────────────────────────────────────── */}
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        <TabNav />

        <div style={{ minHeight: "400px" }}>
          {activeTab === "pulse"     && <PulseTab />}
          {activeTab === "era"       && <EraQuiz />}
          {activeTab === "vote"      && <SetlistVote />}
          {activeTab === "memories"  && <FanMemories />}
          {activeTab === "letters"   && <LettersToLegend />}
          {activeTab === "challenge" && <ChallengeHub />}
          {activeTab === "gallery"   && <FanArtGallery />}
          {activeTab === "map"       && <FanGlobalMap />}
          {activeTab === "aug1"      && <ConcertCheckin />}
        </div>
      </div>

      {/* ── Bottom rule + footer ────────────────────────────────────────── */}
      <div style={{
        width: "100%", maxWidth: "1100px", height: "1px",
        background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
        marginTop: "5rem",
      }} />

      <p style={{ marginTop: "2rem", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase", textAlign: "center" }}>
        King James · 20 Years of Greatness · BK Arena · August 1, 2026
      </p>
      <p
        ref={footerRef}
        style={{ marginTop: "0.5rem", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.12)", textTransform: "uppercase", textAlign: "center" }}
      >
        built with love by @arsene
      </p>

      {/* ── Keyframes ────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes terminalParticle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--vx,0), var(--vy,-40px)) scale(0.1); opacity: 0; }
        }
        @keyframes terminalFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Hide scrollbar on tab nav (webkit) */
        .tab-scroll-hide::-webkit-scrollbar { display: none; }

        /* Mobile touch targets */
        @media (max-width: 640px) {
          input, textarea, select, button { font-size: 16px !important; }
        }
      `}</style>
    </div>
  )
}
