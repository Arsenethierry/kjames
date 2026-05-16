import { useEffect, useState } from "react"

const CONCERT_DATE = new Date("2026-08-01T20:00:00+02:00").getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  past: boolean
}

function calc(): TimeLeft {
  const diff = CONCERT_DATE - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    past: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function CountdownTimer() {
  const [t, setT] = useState<TimeLeft>(calc)

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])

  if (t.past) {
    return (
      <div style={{ textAlign: "center", padding: "2rem 0" }}>
        <p style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, color: "#D4AF37", letterSpacing: "0.06em" }}>
          THE NIGHT IS HERE
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.5rem", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase" }}>
          BK Arena · King James · August 1, 2026
        </p>
      </div>
    )
  }

  const units: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Min", t.minutes],
    ["Sec", t.seconds],
  ]

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{
        fontSize: "0.58rem",
        letterSpacing: "0.5em",
        textTransform: "uppercase",
        color: "#D4AF37",
        marginBottom: "1.4rem",
      }}>
        Countdown to BK Arena
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(0.6rem, 2vw, 1.6rem)",
        flexWrap: "wrap",
      }}>
        {units.map(([label, val]) => (
          <div key={label} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "60px",
          }}>
            <div style={{
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              background: "linear-gradient(135deg, #D4AF37 0%, #fffbe0 50%, #D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {pad(val)}
            </div>
            <div style={{
              fontSize: "0.52rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginTop: "0.3rem",
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <p style={{
        marginTop: "1.2rem",
        fontSize: "0.68rem",
        color: "rgba(255,255,255,0.28)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}>
        August 1, 2026 · Kigali, Rwanda
      </p>
    </div>
  )
}
