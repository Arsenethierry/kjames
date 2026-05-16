import { useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

const ERAS = [
  { index: 0, year: "2006", title: "THE GENESIS", accentHex: "#1a4abf" },
  { index: 1, year: "2010", title: "RISING FLAMES", accentHex: "#f59e0b" },
  { index: 2, year: "2014", title: "THE CONTINENT BOWED", accentHex: "#dc2626" },
  { index: 3, year: "2018", title: "ELECTRIC CROWN", accentHex: "#0d9488" },
  { index: 4, year: "2022", title: "LEGACY FORGED", accentHex: "#7c3aed" },
]

// ─── STORY TEMPLATE GENERATOR ─────────────────────────────────────────────────
function generateStoryTemplate(fanName: string, era: (typeof ERAS)[0]): string {
  const W = 540, H = 960
  const c = document.createElement("canvas")
  c.width = W; c.height = H
  const ctx = c.getContext("2d")!

  // Background
  ctx.fillStyle = "#030308"
  ctx.fillRect(0, 0, W, H)

  // Era glow
  const grd = ctx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, W)
  grd.addColorStop(0, era.accentHex + "66")
  grd.addColorStop(0.5, era.accentHex + "22")
  grd.addColorStop(1, "transparent")
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, W, H)

  // Thick era-colored top band
  ctx.fillStyle = era.accentHex
  ctx.fillRect(0, 0, W, 8)
  ctx.fillRect(0, H - 8, W, 8)

  // Grid lines (subtle)
  ctx.strokeStyle = "rgba(255,255,255,0.03)"
  ctx.lineWidth = 1
  for (let x = 0; x <= W; x += 54) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y <= H; y += 54) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // KING JAMES header
  ctx.textAlign = "center"
  ctx.font = "bold 28px Arial"
  ctx.fillStyle = "#D4AF37"
  ctx.fillText("K I N G   J A M E S", W / 2, 100)

  ctx.font = "400 12px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.35)"
  ctx.fillText("2 0   Y E A R S   O F   G R E A T N E S S", W / 2, 130)

  // Divider
  ctx.strokeStyle = era.accentHex
  ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(80, 155); ctx.lineTo(W - 80, 155); ctx.stroke()

  // "I AM A" label
  ctx.font = "400 14px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.45)"
  ctx.fillText("I   A M   A", W / 2, 240)

  // Era name (giant)
  const words = era.title.split(" ")
  ctx.fillStyle = "#ffffff"
  if (words.length <= 2) {
    ctx.font = "bold 64px Arial"
    if (words.length === 1) {
      ctx.fillText(era.title, W / 2, 340)
    } else {
      ctx.fillText(words[0], W / 2, 300)
      ctx.fillText(words[1], W / 2, 375)
    }
  } else {
    ctx.font = "bold 46px Arial"
    words.forEach((w, i) => ctx.fillText(w, W / 2, 285 + i * 58))
  }

  // "FAN" badge
  const badgeY = words.length > 2 ? 470 : 440
  ctx.font = "bold 20px Arial"
  ctx.fillStyle = era.accentHex
  ctx.fillText("F A N", W / 2, badgeY)

  // Fan name if provided
  if (fanName.trim()) {
    ctx.font = "400 13px Arial"
    ctx.fillStyle = "rgba(255,255,255,0.38)"
    ctx.fillText("—  " + fanName.toUpperCase() + "  —", W / 2, badgeY + 44)
  }

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.08)"
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(80, 560); ctx.lineTo(W - 80, 560); ctx.stroke()

  // Hashtag (main CTA)
  ctx.font = "bold 22px Arial"
  ctx.fillStyle = era.accentHex
  ctx.fillText("#KingJames20Years", W / 2, 628)

  // Concert info
  ctx.font = "600 14px Arial"
  ctx.fillStyle = "#D4AF37"
  ctx.fillText("BK ARENA  ·  AUGUST 1, 2026", W / 2, 700)

  ctx.font = "400 11px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.28)"
  ctx.fillText("Kigali, Rwanda", W / 2, 726)

  // Divider
  ctx.strokeStyle = "rgba(255,255,255,0.06)"
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(80, 820); ctx.lineTo(W - 80, 820); ctx.stroke()

  ctx.font = "400 11px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.25)"
  ctx.fillText("king-james-20years.com", W / 2, 860)

  ctx.font = "400 10px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.15)"
  ctx.fillText("built by @arsene", W / 2, 928)

  return c.toDataURL("image/png")
}

const STEPS = [
  { n: "1", text: "Take the Era DNA quiz to discover your King James era" },
  { n: "2", text: "Download your Era DNA card or Story Template" },
  { n: "3", text: "Post it on TikTok or Instagram Stories" },
  { n: "4", text: "Use the hashtag #KingJames20Years" },
  { n: "5", text: "Tag a friend and challenge them to discover their era" },
]

export default function ChallengeHub() {
  const [joined, setJoined] = useState(() => lsGet("kj_challenge_joined", false))
  const [count, setCount] = useState(() => lsGet("kj_challenge_count", 1_247))
  const [tab, setTab] = useState<"challenge" | "template">("challenge")
  const [selectedEra, setSelectedEra] = useState(0)
  const [templateName, setTemplateName] = useState("")
  const [templateUrl, setTemplateUrl] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  function join() {
    if (joined) return
    const next = count + 1
    setCount(next)
    setJoined(true)
    lsSet("kj_challenge_count", next)
    lsSet("kj_challenge_joined", true)
  }

  function generate() {
    const era = ERAS[selectedEra]
    const url = generateStoryTemplate(templateName, era)
    setTemplateUrl(url)
    setDownloaded(false)
  }

  function downloadTemplate() {
    if (!templateUrl) return
    const era = ERAS[selectedEra]
    const a = document.createElement("a")
    a.href = templateUrl
    a.download = `king-james-${era.year}-story.png`
    a.click()
    setDownloaded(true)
  }

  const tabBtn = (id: "challenge" | "template", label: string) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: "0.55rem 1.4rem",
        background: tab === id ? "rgba(212,175,55,0.15)" : "transparent",
        border: tab === id ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "2rem",
        color: tab === id ? "#D4AF37" : "rgba(255,255,255,0.42)",
        fontSize: "0.7rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "0.6rem", display: "block" }}>
        Fan Challenge
      </span>
      <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: "2rem", lineHeight: 1.2 }}>
        #KingJames20Years
      </h2>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        {tabBtn("challenge", "The Challenge")}
        {tabBtn("template", "Story Templates")}
      </div>

      {/* ── CHALLENGE TAB ─────────────────────────────────────────── */}
      {tab === "challenge" && (
        <>
          {/* Join counter */}
          <div style={{
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "1rem",
            padding: "2rem",
            background: "rgba(212,175,55,0.03)",
            textAlign: "center",
            marginBottom: "2rem",
          }}>
            <p style={{ fontSize: "3rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{count.toLocaleString()}</p>
            <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0.4rem 0 1.4rem" }}>
              fans have joined the challenge
            </p>
            <button
              onClick={join}
              disabled={joined}
              style={{
                padding: "0.8rem 2.4rem",
                background: joined ? "rgba(34,197,94,0.1)" : "linear-gradient(135deg, #D4AF37, #f0c040)",
                border: joined ? "1px solid rgba(34,197,94,0.3)" : "none",
                borderRadius: "2rem",
                color: joined ? "#22c55e" : "#000",
                fontWeight: 800,
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: joined ? "default" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {joined ? "You've Joined ✓" : "Join the Challenge →"}
            </button>
          </div>

          {/* Hashtag display */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0.8rem",
            padding: "1.4rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 900, color: "#D4AF37", letterSpacing: "0.02em", marginBottom: "0.4rem" }}>
              #KingJames20Years
            </p>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              Use this on TikTok · Instagram · Twitter
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0,
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212,175,55,0.35)",
                  background: "rgba(212,175,55,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "#D4AF37",
                }}>
                  {s.n}
                </div>
                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.5, paddingTop: "0.25rem" }}>{s.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── TEMPLATE TAB ──────────────────────────────────────────── */}
      {tab === "template" && (
        <>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.42)", marginBottom: "1.8rem", lineHeight: 1.6 }}>
            Generate a personalized Instagram Story template for your era. Download and post — the hashtag and website are already on it.
          </p>

          {/* Era selector */}
          <div style={{ marginBottom: "1.2rem" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "0.8rem" }}>
              Pick your era
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {ERAS.map((era) => (
                <button
                  key={era.index}
                  onClick={() => { setSelectedEra(era.index); setTemplateUrl(null); setDownloaded(false) }}
                  style={{
                    padding: "0.45rem 0.9rem",
                    background: selectedEra === era.index ? era.accentHex + "22" : "rgba(255,255,255,0.03)",
                    border: selectedEra === era.index ? `1px solid ${era.accentHex}66` : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.5rem",
                    color: selectedEra === era.index ? era.accentHex : "rgba(255,255,255,0.45)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {era.year}
                </button>
              ))}
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: ERAS[selectedEra].accentHex }}>
              {ERAS[selectedEra].title}
            </p>
          </div>

          {/* Name input */}
          <input
            placeholder="Your name (optional)"
            value={templateName}
            onChange={(e) => { setTemplateName(e.target.value); setTemplateUrl(null) }}
            maxLength={30}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.045)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              color: "#fff",
              fontSize: "0.88rem",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              marginBottom: "1.2rem",
            }}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />

          {/* Preview + actions */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <button
              onClick={generate}
              style={{
                padding: "0.8rem 2rem",
                background: "linear-gradient(135deg, #D4AF37, #f0c040)",
                border: "none",
                borderRadius: "2rem",
                color: "#000",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Generate Template →
            </button>
            {templateUrl && (
              <button
                onClick={downloadTemplate}
                style={{
                  padding: "0.8rem 1.8rem",
                  background: downloaded ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.06)",
                  border: downloaded ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "2rem",
                  color: downloaded ? "#22c55e" : "rgba(255,255,255,0.65)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {downloaded ? "Downloaded ✓" : "Download PNG →"}
              </button>
            )}
          </div>

          {templateUrl && (
            <div style={{ marginTop: "1.6rem" }}>
              <img
                src={templateUrl}
                alt="Story template preview"
                style={{
                  width: "min(180px, 40vw)",
                  borderRadius: "0.75rem",
                  boxShadow: `0 12px 40px ${ERAS[selectedEra].accentHex}44`,
                  display: "block",
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
