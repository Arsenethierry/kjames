import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

interface CountryEntry {
  flag: string
  name: string
  pulses: number
}

const SEED: CountryEntry[] = [
  { flag: "🇷🇼", name: "Rwanda", pulses: 8_742 },
  { flag: "🇧🇪", name: "Belgium", pulses: 3_218 },
  { flag: "🇫🇷", name: "France", pulses: 2_891 },
  { flag: "🇨🇦", name: "Canada", pulses: 1_654 },
  { flag: "🇺🇸", name: "United States", pulses: 1_422 },
  { flag: "🇳🇱", name: "Netherlands", pulses: 987 },
  { flag: "🇬🇧", name: "United Kingdom", pulses: 843 },
  { flag: "🇰🇪", name: "Kenya", pulses: 621 },
  { flag: "🇨🇩", name: "DR Congo", pulses: 598 },
  { flag: "🇧🇮", name: "Burundi", pulses: 512 },
  { flag: "🇸🇳", name: "Senegal", pulses: 389 },
  { flag: "🇺🇬", name: "Uganda", pulses: 344 },
  { flag: "🇩🇪", name: "Germany", pulses: 298 },
  { flag: "🇿🇦", name: "South Africa", pulses: 276 },
  { flag: "🇦🇺", name: "Australia", pulses: 189 },
]

const OTHER_COUNTRIES: CountryEntry[] = [
  { flag: "🇪🇸", name: "Spain", pulses: 0 },
  { flag: "🇮🇹", name: "Italy", pulses: 0 },
  { flag: "🇸🇪", name: "Sweden", pulses: 0 },
  { flag: "🇳🇴", name: "Norway", pulses: 0 },
  { flag: "🇯🇵", name: "Japan", pulses: 0 },
  { flag: "🇧🇷", name: "Brazil", pulses: 0 },
  { flag: "🇲🇽", name: "Mexico", pulses: 0 },
  { flag: "🇦🇪", name: "UAE", pulses: 0 },
  { flag: "🇨🇭", name: "Switzerland", pulses: 0 },
  { flag: "🇵🇹", name: "Portugal", pulses: 0 },
  { flag: "🇹🇿", name: "Tanzania", pulses: 0 },
  { flag: "🇬🇭", name: "Ghana", pulses: 0 },
  { flag: "🇳🇬", name: "Nigeria", pulses: 0 },
  { flag: "🇪🇹", name: "Ethiopia", pulses: 0 },
  { flag: "🇲🇿", name: "Mozambique", pulses: 0 },
]

const ALL_COUNTRIES = [...SEED, ...OTHER_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name))

export default function FanGlobalMap() {
  const [map, setMap] = useState<Record<string, number>>(() =>
    lsGet("kj_country_pulses", Object.fromEntries(SEED.map((c) => [c.name, c.pulses])))
  )
  const [myCountry, setMyCountry] = useState<string | null>(() => lsGet("kj_my_country", null))
  const [pulsed, setPulsed] = useState(() => lsGet("kj_country_pulsed", false))
  const [selected, setSelected] = useState("")

  const entries: CountryEntry[] = ALL_COUNTRIES.map((c) => ({
    ...c,
    pulses: map[c.name] ?? c.pulses,
  })).sort((a, b) => b.pulses - a.pulses)

  const total = Object.values(map).reduce((a, b) => a + b, 0) + SEED.reduce((a, c) => a + (map[c.name] ? 0 : c.pulses), 0)

  function represent() {
    if (!selected || pulsed) return
    const next = { ...map, [selected]: (map[selected] ?? 0) + 1 }
    setMap(next)
    setMyCountry(selected)
    setPulsed(true)
    lsSet("kj_country_pulses", next)
    lsSet("kj_my_country", selected)
    lsSet("kj_country_pulsed", true)
  }

  const topMax = entries[0]?.pulses || 1

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "0.6rem", display: "block" }}>
        Global Fan Pulse
      </span>
      <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        We Are Everywhere
      </h2>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: "2rem", lineHeight: 1.6 }}>
        King James fans across the globe. Represent your country and show Rwanda the world is watching.
      </p>

      {/* Total count */}
      <div style={{
        border: "1px solid rgba(212,175,55,0.18)",
        borderRadius: "1rem",
        padding: "1.6rem",
        background: "rgba(212,175,55,0.03)",
        textAlign: "center",
        marginBottom: "1.8rem",
      }}>
        <p style={{ fontSize: "2.8rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{total.toLocaleString()}</p>
        <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "0.4rem" }}>
          global love pulses · {entries.filter((e) => e.pulses > 0).length} countries
        </p>
      </div>

      {/* Represent your country */}
      {!pulsed ? (
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "0.8rem",
          padding: "1.4rem",
          background: "rgba(255,255,255,0.02)",
          marginBottom: "2rem",
          display: "flex",
          gap: "0.8rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              Represent your country
            </p>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{
                width: "100%",
                padding: "0.7rem 0.9rem",
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "0.5rem",
                color: selected ? "#fff" : "rgba(255,255,255,0.35)",
                fontSize: "0.88rem",
                fontFamily: "inherit",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="" style={{ background: "#030308" }}>Select your country…</option>
              {ALL_COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                <option key={c.name} value={c.name} style={{ background: "#030308" }}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={represent}
            disabled={!selected}
            style={{
              padding: "0.72rem 1.6rem",
              background: selected ? "linear-gradient(135deg, #D4AF37, #f0c040)" : "rgba(255,255,255,0.04)",
              border: "none",
              borderRadius: "0.5rem",
              color: selected ? "#000" : "rgba(255,255,255,0.25)",
              fontWeight: 800,
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: selected ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Represent →
          </button>
        </div>
      ) : (
        <div style={{
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "0.8rem",
          padding: "1.2rem 1.4rem",
          background: "rgba(34,197,94,0.05)",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
        }}>
          <span style={{ fontSize: "1.4rem" }}>{ALL_COUNTRIES.find((c) => c.name === myCountry)?.flag}</span>
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22c55e" }}>{myCountry} is on the map ✓</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginTop: "0.15rem" }}>
              You represent {(entries.find((e) => e.name === myCountry)?.pulses ?? 0).toLocaleString()} pulses from your country
            </p>
          </div>
        </div>
      )}

      {/* Country leaderboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {entries.filter((e) => e.pulses > 0).map((entry, i) => {
          const pct = Math.round((entry.pulses / topMax) * 100)
          const isMe = entry.name === myCountry

          return (
            <div key={entry.name} style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "0.6rem",
              border: isMe ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.05)",
              background: isMe ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.02)",
            }}>
              {/* Fill bar */}
              <div style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: `${pct}%`,
                background: i === 0 ? "rgba(212,175,55,0.12)" : "rgba(255,255,255,0.04)",
                transition: "width 0.6s ease",
              }} />

              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.75rem 1rem" }}>
                <span style={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  color: i === 0 ? "#D4AF37" : "rgba(255,255,255,0.28)",
                  minWidth: "20px",
                  textAlign: "right",
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: "1.3rem" }}>{entry.flag}</span>
                <span style={{
                  fontSize: "0.88rem",
                  fontWeight: isMe ? 700 : 400,
                  color: isMe ? "#D4AF37" : "rgba(255,255,255,0.72)",
                  flex: 1,
                }}>
                  {entry.name}
                  {isMe && <span style={{ fontSize: "0.58rem", color: "#D4AF37", marginLeft: "0.4rem" }}>(you)</span>}
                </span>
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: i === 0 ? "#D4AF37" : "rgba(255,255,255,0.55)",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {entry.pulses.toLocaleString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
