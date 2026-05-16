import { useRef, useState } from "react"
import { lsGet, lsSet } from "@/lib/storage"

interface ArtPiece {
  id: number
  name: string
  title: string
  era: string
  eraColor: string
  dataUrl: string
  timestamp: string
}

const ERA_OPTIONS = [
  { label: "THE GENESIS · 2006", color: "#1a4abf" },
  { label: "RISING FLAMES · 2010", color: "#f59e0b" },
  { label: "THE CONTINENT BOWED · 2014", color: "#dc2626" },
  { label: "ELECTRIC CROWN · 2018", color: "#0d9488" },
  { label: "LEGACY FORGED · 2022", color: "#7c3aed" },
  { label: "ALL ERAS", color: "#D4AF37" },
]

// Pure-string SVG placeholder — works in both SSR and browser (no document needed)
function makePlaceholder(accentHex: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="${accentHex}" stop-opacity="0.75"/><stop offset="100%" stop-color="#000000" stop-opacity="1"/></radialGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="185" font-family="Arial" font-size="22" font-weight="bold" fill="rgba(255,255,255,0.65)" text-anchor="middle">KING JAMES</text><text x="200" y="218" font-family="Arial" font-size="14" fill="${accentHex}" text-anchor="middle">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const SEED: ArtPiece[] = [
  { id: 0, name: "Uwimana J.", title: "Genesis Portrait", era: "THE GENESIS · 2006", eraColor: "#1a4abf", dataUrl: makePlaceholder("#1a4abf", "2006"), timestamp: "May 2026" },
  { id: 1, name: "Kagabo P.", title: "Rising Flames", era: "RISING FLAMES · 2010", eraColor: "#f59e0b", dataUrl: makePlaceholder("#f59e0b", "2010"), timestamp: "May 2026" },
  { id: 2, name: "Ingabire C.", title: "Continental Crown", era: "THE CONTINENT BOWED · 2014", eraColor: "#dc2626", dataUrl: makePlaceholder("#dc2626", "2014"), timestamp: "May 2026" },
]

let nextId = SEED.length

export default function FanArtGallery() {
  const [pieces, setPieces] = useState<ArtPiece[]>(() => lsGet("kj_fan_art", SEED))
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [eraIdx, setEraIdx] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [filterEra, setFilterEra] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert("Please use an image under 2 MB."); return }
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!preview || !name.trim()) return
    setUploading(true)
    const era = ERA_OPTIONS[eraIdx]
    const piece: ArtPiece = {
      id: nextId++,
      name: name.trim(),
      title: title.trim() || "Untitled",
      era: era.label,
      eraColor: era.color,
      dataUrl: preview,
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    }
    const next = [piece, ...pieces].slice(0, 30)  // cap at 30 to protect localStorage
    setPieces(next)
    try { lsSet("kj_fan_art", next) } catch { /* storage full */ }
    setName(""); setTitle(""); setPreview(null); setEraIdx(0)
    if (fileRef.current) fileRef.current.value = ""
    setUploading(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const filtered = filterEra ? pieces.filter((p) => p.era === filterEra) : pieces

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0.5rem",
    padding: "0.7rem 0.9rem",
    color: "#fff",
    fontSize: "0.85rem",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.25s",
    boxSizing: "border-box" as const,
    width: "100%",
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <span style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#D4AF37", marginBottom: "0.6rem", display: "block" }}>
        Fan Art Gallery
      </span>
      <h2 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.5rem", lineHeight: 1.2 }}>
        Create. Submit. Be Seen.
      </h2>
      <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", marginBottom: "2rem", lineHeight: 1.6 }}>
        Fan art, edits, portraits, posters — anything inspired by King James. Submit below and join the gallery.
      </p>

      {/* Upload form */}
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
            placeholder="Art title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            style={inputStyle}
            onFocus={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)")}
            onBlur={(e) => ((e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Era selector */}
        <div style={{ marginBottom: "0.7rem" }}>
          <select
            value={eraIdx}
            onChange={(e) => setEraIdx(Number(e.target.value))}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none" as const,
            }}
          >
            {ERA_OPTIONS.map((era, i) => (
              <option key={i} value={i} style={{ background: "#030308" }}>{era.label}</option>
            ))}
          </select>
        </div>

        {/* File input */}
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: `1.5px dashed ${preview ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: "0.6rem",
            padding: "1.4rem",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "0.7rem",
            background: preview ? "rgba(212,175,55,0.04)" : "rgba(255,255,255,0.02)",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: "180px", maxWidth: "100%", borderRadius: "0.4rem", objectFit: "contain" }}
            />
          ) : (
            <>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.3rem" }}>Click to upload your art</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.22)" }}>JPG, PNG, WebP · Max 2MB</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={!preview || !name.trim() || uploading}
            style={{
              padding: "0.7rem 1.8rem",
              background: submitted ? "rgba(34,197,94,0.12)" : (!preview || !name.trim()) ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(212,175,55,0.06))",
              border: submitted ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(212,175,55,0.3)",
              borderRadius: "0.5rem",
              color: submitted ? "#22c55e" : "#D4AF37",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: preview && name.trim() && !uploading ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            {submitted ? "Submitted ✓" : "Submit Art →"}
          </button>
        </div>
      </form>

      {/* Era filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setFilterEra(null)}
          style={{
            padding: "0.35rem 0.9rem",
            background: filterEra === null ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
            border: filterEra === null ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: "2rem",
            color: filterEra === null ? "#D4AF37" : "rgba(255,255,255,0.38)",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          All ({pieces.length})
        </button>
        {ERA_OPTIONS.slice(0, 5).map((era) => {
          const cnt = pieces.filter((p) => p.era === era.label).length
          if (cnt === 0) return null
          return (
            <button
              key={era.label}
              onClick={() => setFilterEra(era.label)}
              style={{
                padding: "0.35rem 0.9rem",
                background: filterEra === era.label ? era.color + "22" : "rgba(255,255,255,0.03)",
                border: filterEra === era.label ? `1px solid ${era.color}55` : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2rem",
                color: filterEra === era.label ? era.color : "rgba(255,255,255,0.38)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {era.label.split(" · ")[1] || era.label} ({cnt})
            </button>
          )
        })}
      </div>

      {/* Gallery grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1rem",
      }}>
        {filtered.map((piece) => (
          <div key={piece.id} style={{
            border: `1px solid ${piece.eraColor}33`,
            borderRadius: "0.8rem",
            overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = "translateY(-3px)"
              el.style.boxShadow = `0 8px 32px ${piece.eraColor}33`
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = "translateY(0)"
              el.style.boxShadow = "none"
            }}
          >
            <img
              src={piece.dataUrl}
              alt={piece.title}
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "0.8rem" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>{piece.title}</p>
              <p style={{ fontSize: "0.65rem", color: "#D4AF37", marginBottom: "0.2rem" }}>{piece.name}</p>
              <p style={{ fontSize: "0.58rem", color: piece.eraColor, letterSpacing: "0.08em" }}>
                {piece.era.split(" · ")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
