import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

const CONCERT_DATE = new Date("2026-08-01T00:00:00+02:00")

function isConcertDay() {
  const now = new Date()
  return now.getFullYear() === 2026 && now.getMonth() === 7 && now.getDate() === 1
}

function daysUntil() {
  const diff = CONCERT_DATE.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export default function ConcertCheckin() {
  const [checked, setChecked] = useState(() => lsGet("kj_checkin", false))
  const [count, setCount] = useState(() => lsGet("kj_checkin_count", 347))
  const [watching, setWatching] = useState(() => lsGet("kj_watching", false))
  const [watchCount, setWatchCount] = useState(() => lsGet("kj_watch_count", 2_841))
  const [mode, setMode] = useState<"arena" | "world">("arena")
  const isDay = isConcertDay()
  const days = daysUntil()

  function checkIn(type: "arena" | "world") {
    if (type === "arena") {
      if (checked) return
      const next = count + 1
      setCount(next)
      setChecked(true)
      setMode("arena")
      lsSet("kj_checkin", true)
      lsSet("kj_checkin_count", next)
    } else {
      if (watching) return
      const next = watchCount + 1
      setWatchCount(next)
      setWatching(true)
      setMode("world")
      lsSet("kj_watching", true)
      lsSet("kj_watch_count", next)
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <span style={{
        fontSize: "0.58rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: "#D4AF37",
        marginBottom: "0.6rem",
        display: "block",
      }}>
        {isDay ? "It's Happening Now" : `${days} Days Away`}
      </span>

      <h2 style={{
        fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
        fontWeight: 900,
        color: "#fff",
        lineHeight: 1.1,
        marginBottom: "0.6rem",
      }}>
        {isDay ? "Tonight is the Night" : "August 1, 2026"}
      </h2>

      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6, marginBottom: "2.2rem" }}>
        {isDay
          ? "King James takes the BK Arena stage tonight. Mark your place in this historic night."
          : `In ${days} day${days !== 1 ? "s" : ""}, BK Arena becomes the centre of the world. Will you be there?`}
      </p>

      {/* Split counter */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "2rem",
      }}>
        {/* At the arena */}
        <div style={{
          border: `1px solid ${isDay ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "1rem",
          padding: "1.6rem 1rem",
          background: isDay ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem" }}>🏟️</div>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#D4AF37", lineHeight: 1, margin: "0.6rem 0 0.2rem" }}>
            {count.toLocaleString()}
          </p>
          <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            {isDay ? "at BK Arena" : "will be there"}
          </p>
        </div>

        {/* Watching worldwide */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          padding: "1.6rem 1rem",
          background: "rgba(255,255,255,0.02)",
        }}>
          <div style={{ fontSize: "2rem" }}>🌍</div>
          <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", lineHeight: 1, margin: "0.6rem 0 0.2rem" }}>
            {watchCount.toLocaleString()}
          </p>
          <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            watching worldwide
          </p>
        </div>
      </div>

      {/* Check-in buttons */}
      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => checkIn("arena")}
          disabled={checked}
          style={{
            padding: "0.9rem 2rem",
            background: checked && mode === "arena"
              ? "rgba(212,175,55,0.1)"
              : isDay
              ? "linear-gradient(135deg, #D4AF37, #f0c040)"
              : "rgba(212,175,55,0.08)",
            border: checked && mode === "arena"
              ? "1px solid rgba(212,175,55,0.35)"
              : isDay
              ? "none"
              : "1px solid rgba(212,175,55,0.2)",
            borderRadius: "2rem",
            color: checked && mode === "arena" ? "#D4AF37" : isDay ? "#000" : "rgba(212,175,55,0.7)",
            fontWeight: 800,
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: checked ? "default" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {checked && mode === "arena"
            ? "You're There ✓"
            : isDay
            ? "I'm at BK Arena →"
            : "I'll Be There →"}
        </button>

        <button
          onClick={() => checkIn("world")}
          disabled={watching}
          style={{
            padding: "0.9rem 2rem",
            background: watching && mode === "world" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
            border: watching && mode === "world"
              ? "1px solid rgba(255,255,255,0.2)"
              : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2rem",
            color: watching && mode === "world" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: watching ? "default" : "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {watching && mode === "world" ? "Watching Worldwide ✓" : "Watching Worldwide →"}
        </button>
      </div>

      <p style={{
        marginTop: "1.6rem",
        fontSize: "0.65rem",
        color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
      }}>
        BK Arena · Kigali, Rwanda · August 1, 2026
      </p>
    </div>
  )
}
