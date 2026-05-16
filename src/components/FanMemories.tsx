import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

interface Memory {
  id: number
  name: string
  year: number
  text: string
  country: string
}

const SEED: Memory[] = [
  { id: 0, name: "Amina K.", year: 2006, text: "I heard him on the radio for the first time. Nothing was the same after.", country: "Rwanda" },
  { id: 1, name: "Patrick N.", year: 2010, text: "Saw him perform live at a local show — the energy was unreal.", country: "Rwanda" },
  { id: 2, name: "Sophie M.", year: 2014, text: "Played Urugamba on repeat while studying abroad in Brussels. Felt like home.", country: "Belgium" },
  { id: 3, name: "Eric D.", year: 2018, text: "Introduced my entire friend group to his music. They were all converted instantly.", country: "France" },
  { id: 4, name: "Grace U.", year: 2022, text: "Legacy Forged dropped on my birthday. Best gift the universe ever gave me.", country: "Canada" },
]

let nextId = SEED.length

const ERA_FOR_YEAR = (year: number) => {
  if (year <= 2009) return { label: "THE GENESIS", color: "#1a4abf" }
  if (year <= 2013) return { label: "RISING FLAMES", color: "#f59e0b" }
  if (year <= 2017) return { label: "THE CONTINENT BOWED", color: "#dc2626" }
  if (year <= 2021) return { label: "ELECTRIC CROWN", color: "#0d9488" }
  return { label: "LEGACY FORGED", color: "#7c3aed" }
}

export default function FanMemories() {
  const [memories, setMemories] = useState<Memory[]>(() => lsGet("kj_fan_memories", SEED))
  const [name, setName] = useState("")
  const [year, setYear] = useState(2014)
  const [text, setText] = useState("")
  const [country, setCountry] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    const mem: Memory = { id: nextId++, name: name.trim(), year, text: text.trim(), country: country.trim() || "Rwanda" }
    const next = [mem, ...memories]
    setMemories(next)
    lsSet("kj_fan_memories", next)
    setName(""); setText(""); setCountry(""); setYear(2014)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const sorted = [...memories].sort((a, b) => a.year - b.year)

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
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "0.6rem", display: "block" }}>
        Fan Memory Timeline
      </span>
      <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        When Did King James Enter Your Life?
      </h2>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: "2rem", lineHeight: 1.6 }}>
        Share the year and one memory. Your moment joins the collective timeline of 20 years.
      </p>

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
            maxLength={40}
            style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />
          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            maxLength={30}
            style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Year slider */}
        <div style={{ marginBottom: "0.7rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>Year you discovered him</span>
            <span style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: ERA_FOR_YEAR(year).color,
              letterSpacing: "0.05em",
            }}>
              {year}
            </span>
          </div>
          <input
            type="range"
            min={2006}
            max={2026}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: "100%", accentColor: ERA_FOR_YEAR(year).color }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.25)" }}>2006</span>
            <span style={{ fontSize: "0.58rem", color: ERA_FOR_YEAR(year).color }}>{ERA_FOR_YEAR(year).label}</span>
            <span style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.25)" }}>2026</span>
          </div>
        </div>

        <textarea
          placeholder="One memory from that year…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" as const }}
          onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
          onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.7rem" }}>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)" }}>{text.length}/200</span>
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
            {submitted ? "Added ✓" : "Add Memory →"}
          </button>
        </div>
      </form>

      {/* Timeline */}
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute",
          left: "42px",
          top: 0,
          bottom: 0,
          width: "1px",
          background: "linear-gradient(to bottom, rgba(212,175,55,0.4), rgba(212,175,55,0.05))",
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {sorted.map((mem) => {
            const era = ERA_FOR_YEAR(mem.year)
            return (
              <div key={mem.id} style={{ display: "flex", gap: "1.2rem", paddingLeft: "0" }}>
                {/* Year bubble */}
                <div style={{
                  flexShrink: 0,
                  width: "84px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.3rem",
                  paddingTop: "0.2rem",
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: era.color + "22",
                    border: `1.5px solid ${era.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.52rem",
                    fontWeight: 800,
                    color: era.color,
                    letterSpacing: "0.02em",
                  }}>
                    {mem.year}
                  </div>
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  borderLeft: `2px solid ${era.color}33`,
                  paddingLeft: "1rem",
                  paddingBottom: "0.2rem",
                }}>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#D4AF37" }}>{mem.name}</span>
                    {mem.country && (
                      <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
                        {mem.country}
                      </span>
                    )}
                    <span style={{ fontSize: "0.58rem", color: era.color, letterSpacing: "0.08em", marginLeft: "auto" }}>
                      {era.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.55 }}>
                    {mem.text}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
