import { useEffect, useState } from "react"

const BASE = 187
const VARIANCE = 93

function jitter(base: number) {
  return base + Math.floor((Math.random() - 0.5) * VARIANCE)
}

export default function LivePresence() {
  const [count, setCount] = useState(() => jitter(BASE))

  useEffect(() => {
    const id = setInterval(() => setCount(jitter(BASE)), 28_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.6rem",
      padding: "0.55rem 1.2rem",
      background: "rgba(212,175,55,0.06)",
      border: "1px solid rgba(212,175,55,0.15)",
      borderRadius: "2rem",
      width: "fit-content",
      margin: "0 auto",
    }}>
      <span style={{
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "#22c55e",
        boxShadow: "0 0 8px #22c55e",
        flexShrink: 0,
        animation: "presencePulse 2s ease-in-out infinite",
      }} />
      <span style={{
        fontSize: "0.68rem",
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}>
        <strong style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>{count.toLocaleString()}</strong>
        {" "}fans on this journey right now
      </span>
      <style>{`
        @keyframes presencePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.5); }
        }
      `}</style>
    </div>
  )
}
