import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

const SONGS = [
  { id: "inzozi", title: "Inzozi", era: "2006 · THE GENESIS", eraColor: "#1a4abf" },
  { id: "ikizere", title: "Ikizere", era: "2010 · RISING FLAMES", eraColor: "#f59e0b" },
  { id: "urugamba", title: "Urugamba", era: "2014 · THE CONTINENT BOWED", eraColor: "#dc2626" },
  { id: "ikamba", title: "Ikamba", era: "2018 · ELECTRIC CROWN", eraColor: "#0d9488" },
  { id: "amateka", title: "Amateka", era: "2022 · LEGACY FORGED", eraColor: "#7c3aed" },
  { id: "kigali", title: "Kigali Tonight", era: "Special · BK ARENA 2026", eraColor: "#D4AF37" },
]

const SEED: Record<string, number> = {
  inzozi: 1842,
  ikizere: 2370,
  urugamba: 3105,
  ikamba: 2688,
  amateka: 1924,
  kigali: 4231,
}

function loadVotes(): Record<string, number> {
  return lsGet("kj_setlist_votes", SEED)
}

export default function SetlistVote() {
  const [votes, setVotes] = useState<Record<string, number>>(loadVotes)
  const [voted, setVoted] = useState<string | null>(() => lsGet("kj_voted_song", null))

  const total = Object.values(votes).reduce((a, b) => a + b, 0)

  function vote(id: string) {
    if (voted) return
    const next = { ...votes, [id]: (votes[id] ?? 0) + 1 }
    setVotes(next)
    setVoted(id)
    lsSet("kj_setlist_votes", next)
    lsSet("kj_voted_song", id)
  }

  const sorted = [...SONGS].sort((a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0))

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <span style={{
        fontSize: "0.58rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: "#D4AF37",
        marginBottom: "0.6rem",
        display: "block",
      }}>
        Setlist Democracy
      </span>
      <h2 style={{
        fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
        fontWeight: 900,
        color: "#fff",
        marginBottom: "0.6rem",
        lineHeight: 1.2,
      }}>
        Vote the BK Arena Opening Song
      </h2>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: "2rem", lineHeight: 1.6 }}>
        {voted
          ? "Your vote is in. Results are live below."
          : "Tap your pick. The top voted song could open the show."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sorted.map((song) => {
          const count = votes[song.id] ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          const isVoted = voted === song.id
          const isLeading = sorted[0].id === song.id

          return (
            <button
              key={song.id}
              onClick={() => vote(song.id)}
              disabled={!!voted}
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                padding: "1rem 1.2rem",
                background: isVoted
                  ? `linear-gradient(135deg, ${song.eraColor}22, ${song.eraColor}0a)`
                  : "rgba(255,255,255,0.03)",
                border: isVoted
                  ? `1px solid ${song.eraColor}66`
                  : isLeading && voted
                  ? "1px solid rgba(212,175,55,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "0.75rem",
                cursor: voted ? "default" : "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (voted) return
                const el = e.currentTarget as HTMLElement
                el.style.background = `${song.eraColor}18`
                el.style.borderColor = `${song.eraColor}44`
              }}
              onMouseLeave={(e) => {
                if (voted) return
                const el = e.currentTarget as HTMLElement
                el.style.background = "rgba(255,255,255,0.03)"
                el.style.borderColor = "rgba(255,255,255,0.07)"
              }}
            >
              {/* Progress fill bar */}
              {voted && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${pct}%`,
                  background: `${song.eraColor}12`,
                  transition: "width 0.8s ease",
                  pointerEvents: "none",
                }} />
              )}

              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.25rem" }}>
                    {isLeading && voted && (
                      <span style={{
                        fontSize: "0.52rem",
                        background: "#D4AF37",
                        color: "#000",
                        fontWeight: 800,
                        padding: "0.1rem 0.4rem",
                        borderRadius: "0.3rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        #1
                      </span>
                    )}
                    {isVoted && (
                      <span style={{ fontSize: "0.52rem", color: song.eraColor, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        Your vote ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>{song.title}</div>
                  <div style={{ fontSize: "0.62rem", color: song.eraColor, letterSpacing: "0.1em", marginTop: "0.2rem" }}>
                    {song.era}
                  </div>
                </div>
                {voted && (
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>
                      {count.toLocaleString()} votes
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <p style={{
        marginTop: "1.6rem",
        fontSize: "0.62rem",
        color: "rgba(255,255,255,0.22)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        textAlign: "center",
      }}>
        {total.toLocaleString()} votes cast · Results shared with King James&apos; team
      </p>
    </div>
  )
}
