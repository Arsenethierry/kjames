import { useEffect } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ─── ERA DATA ─────────────────────────────────────────────────────────────────
interface EraData {
  index: number
  year: string
  title: string
  subtitle: string
  accent: number
  accentHex: string
}

const ERAS: EraData[] = [
  {
    index: 0,
    year: "2006",
    title: "THE GENESIS",
    subtitle: "2006 — THE GENESIS",
    accent: 0x1a4abf,
    accentHex: "#1a4abf",
  },
  {
    index: 1,
    year: "2010",
    title: "RISING FLAMES",
    subtitle: "2010 — RISING FLAMES",
    accent: 0xf59e0b,
    accentHex: "#f59e0b",
  },
  {
    index: 2,
    year: "2014",
    title: "THE CONTINENT BOWED",
    subtitle: "2014 — THE CONTINENT BOWED",
    accent: 0xdc2626,
    accentHex: "#dc2626",
  },
  {
    index: 3,
    year: "2018",
    title: "ELECTRIC CROWN",
    subtitle: "2018 — ELECTRIC CROWN",
    accent: 0x0d9488,
    accentHex: "#0d9488",
  },
  {
    index: 4,
    year: "2022",
    title: "LEGACY FORGED",
    subtitle: "2022 — LEGACY FORGED",
    accent: 0x7c3aed,
    accentHex: "#7c3aed",
  },
]

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CAM_START_Z = 40
const CAM_Y = 3.8
const SCREEN_RADIUS = 13
const SCREEN_W = 8
const SCREEN_H = 4.5

// ─── TEXTURE FACTORIES ────────────────────────────────────────────────────────
function buildScreenTexture(era: EraData, bright: boolean): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 576
  const ctx = c.getContext("2d")!

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, 576)
  bg.addColorStop(0, bright ? "#080820" : "#04040f")
  bg.addColorStop(1, bright ? "#0c0c26" : "#060612")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 1024, 576)

  // Grid
  ctx.strokeStyle = bright ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.025)"
  ctx.lineWidth = 1
  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 576); ctx.stroke()
  }
  for (let y = 0; y <= 576; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  // Ghost year watermark
  ctx.font = "bold 220px Arial"
  ctx.fillStyle = `rgba(255,255,255,${bright ? 0.04 : 0.015})`
  ctx.textAlign = "center"
  ctx.fillText(era.year, 512, 400)

  // Accent rules
  ctx.fillStyle = era.accentHex
  ctx.fillRect(180, 195, 664, 2)
  ctx.fillRect(180, 415, 664, 1)

  // Corner accent dots
  ;[180, 844].forEach((x) => {
    ctx.beginPath()
    ctx.arc(x, 193, 5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Year text
  ctx.font = `bold ${bright ? 100 : 88}px Arial`
  ctx.fillStyle = bright ? "#ffffff" : "rgba(255,255,255,0.4)"
  ctx.textAlign = "center"
  ctx.fillText(era.year, 512, 310)

  // Era title
  ctx.font = `${bright ? "600" : "400"} 34px Arial`
  ctx.fillStyle = bright ? era.accentHex : `${era.accentHex}80`
  ctx.fillText(era.title, 512, 370)

  return new THREE.CanvasTexture(c)
}

function buildArenaTextTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 256
  const ctx = c.getContext("2d")!

  ctx.fillStyle = "#02020c"
  ctx.fillRect(0, 0, 1024, 256)

  // Gold border
  ctx.strokeStyle = "#D4AF37"
  ctx.lineWidth = 3
  ctx.strokeRect(12, 12, 1000, 232)

  // Inner accent line
  ctx.fillStyle = "#D4AF37"
  ctx.fillRect(60, 120, 904, 1)

  ctx.font = "bold 78px Arial"
  ctx.fillStyle = "#D4AF37"
  ctx.textAlign = "center"
  ctx.fillText("BK ARENA", 512, 108)

  ctx.font = "500 38px Arial"
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.fillText("KING JAMES · 2026", 512, 172)

  ctx.font = "300 22px Arial"
  ctx.fillStyle = "rgba(212,175,55,0.55)"
  ctx.fillText("20 YEARS OF GREATNESS · AUGUST 1", 512, 218)

  return new THREE.CanvasTexture(c)
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ThreeEngine() {
  useEffect(() => {
    const canvas = document.getElementById("webgl") as HTMLCanvasElement | null
    if (!canvas) return

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
      alpha: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Mobile: cut pixel ratio to save GPU
    if (window.innerWidth < 768) renderer.setPixelRatio(1)

    // ── Scene & Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000005)
    scene.fog = new THREE.FogExp2(0x000005, 0.005)

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400,
    )
    camera.position.set(0, CAM_Y, CAM_START_Z)
    camera.rotation.set(0, 0, 0)

    // ── Ambient lighting (baked-style, no shadow-casting lights) ───────────
    scene.add(new THREE.AmbientLight(0x080818, 1.2))
    scene.add(new THREE.HemisphereLight(0x0a0a28, 0x000000, 0.6))

    // ══════════════════════════════════════════════════════════════════════
    // KIGALI CITY PARTICLES  (1 draw call)
    // ══════════════════════════════════════════════════════════════════════
    const CITY_COUNT = 3000
    const cityPositions = new Float32Array(CITY_COUNT * 3)
    const cityColors = new Float32Array(CITY_COUNT * 3)
    const warmPalette = [
      [1.0, 0.72, 0.22],
      [1.0, 0.52, 0.12],
      [1.0, 0.92, 0.55],
      [0.88, 0.68, 0.28],
      [1.0, 0.88, 0.72],
    ]
    for (let i = 0; i < CITY_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 35 + Math.random() * 180
      cityPositions[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 25
      cityPositions[i * 3 + 1] = -28 + Math.random() * 10
      cityPositions[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 25
      const col = warmPalette[Math.floor(Math.random() * warmPalette.length)]
      const b = 0.45 + Math.random() * 0.55
      cityColors[i * 3] = col[0] * b
      cityColors[i * 3 + 1] = col[1] * b
      cityColors[i * 3 + 2] = col[2] * b
    }
    const cityGeo = new THREE.BufferGeometry()
    cityGeo.setAttribute("position", new THREE.BufferAttribute(cityPositions, 3))
    cityGeo.setAttribute("color", new THREE.BufferAttribute(cityColors, 3))
    const cityMat = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
    scene.add(new THREE.Points(cityGeo, cityMat))

    // ══════════════════════════════════════════════════════════════════════
    // BK ARENA EXTERIOR GROUP
    // ══════════════════════════════════════════════════════════════════════
    const exterior = new THREE.Group()

    const makeNavy = () =>
      new THREE.MeshStandardMaterial({
        color: 0x060918,
        metalness: 0.32,
        roughness: 0.62,
        transparent: true,
        opacity: 1,
      })

    const makeGoldEdge = () =>
      new THREE.LineBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 1,
      })

    const addBoxWithEdges = (
      geoArgs: [number, number, number],
      pos: [number, number, number],
    ) => {
      const geo = new THREE.BoxGeometry(...geoArgs)
      const mesh = new THREE.Mesh(geo, makeNavy())
      mesh.position.set(...pos)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), makeGoldEdge())
      edges.position.set(...pos)
      exterior.add(mesh, edges)
    }

    // Main arena body
    addBoxWithEdges([38, 14, 46], [0, 7, -5])
    // Dome
    {
      const geo = new THREE.CylinderGeometry(23, 21, 5, 14)
      const mesh = new THREE.Mesh(geo, makeNavy())
      mesh.position.set(0, 16, -5)
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), makeGoldEdge())
      edges.position.copy(mesh.position)
      exterior.add(mesh, edges)
    }
    // Entrance marquee
    addBoxWithEdges([22, 5, 5], [0, 2.5, 19])
    // Side buttresses
    for (const x of [-22, 22]) {
      addBoxWithEdges([6, 10, 32], [x, 5, -2])
    }
    // Upper accent ring
    {
      const geo = new THREE.TorusGeometry(22, 0.4, 8, 48)
      const mesh = new THREE.Mesh(geo, makeNavy())
      mesh.position.set(0, 18, -5)
      mesh.rotation.x = Math.PI / 2
      exterior.add(mesh)
    }

    // Text panel on front face
    const arenaTextTex = buildArenaTextTexture()
    {
      const geo = new THREE.PlaneGeometry(22, 5.5)
      const mat = new THREE.MeshBasicMaterial({
        map: arenaTextTex,
        transparent: true,
        opacity: 1,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 7.5, 18.6)
      exterior.add(mesh)
    }

    // Pre-entry spotlights cutting down
    ;[0x3355ff, 0xff3344, 0xffffff].forEach((col, i) => {
      const geo = new THREE.CylinderGeometry(0.2, 7, 32, 8, 1, true)
      const mat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.055,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const cone = new THREE.Mesh(geo, mat)
      cone.position.set((i - 1) * 14, 22, -8)
      exterior.add(cone)
    })

    scene.add(exterior)

    // Collect all exterior materials for the phase-through dissolve
    const exteriorMats: Array<THREE.Material> = []
    exterior.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        exteriorMats.push(...mats)
      }
    })

    // ══════════════════════════════════════════════════════════════════════
    // PHOTO PARALLAX LAYERS  (2.5D depth illusion from a single photograph)
    // ══════════════════════════════════════════════════════════════════════
    // Place the real BK Arena photo at:  public/images/bk-arena.jpg
    //
    // Three PlaneGeometry meshes at different Z depths create natural parallax
    // via PerspectiveCamera projection as the camera flies in during Act I:
    //   Far  (z=-46): full image as night sky / atmosphere  — slow parallax
    //   Mid  (z=-12): cropped to the circular facade         — medium parallax
    //   Near (z= 18): cropped to entrance + BK ARENA sign   — fast, leads dissolve

    interface PhotoLayerCfg {
      z: number; y: number; w: number; h: number
      ox: number; oy: number; rx: number; ry: number
      maxOp: number
    }

    const PHOTO_CFG: PhotoLayerCfg[] = [
      { z: -46, y: 10, w: 108, h: 66, ox: 0.0,  oy: 0.0,  rx: 1.0,  ry: 1.0,  maxOp: 0.55 },
      { z: -12, y: 10, w:  66, h: 41, ox: 0.02, oy: 0.10, rx: 0.96, ry: 0.85, maxOp: 0.82 },
      { z:  18, y:  9, w:  40, h: 25, ox: 0.05, oy: 0.02, rx: 0.90, ry: 0.78, maxOp: 1.0  },
    ]

    const photoLayerMats: THREE.MeshBasicMaterial[] = []

    PHOTO_CFG.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h)
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,          // starts invisible; set after texture loads
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, cfg.y, cfg.z)
      exterior.add(mesh)    // part of exterior → auto-dissolved in phase-through
      photoLayerMats.push(mat)
    })

    // Guard against async callback firing after cleanup
    let engineDisposed = false

    new THREE.TextureLoader().load(
      "/images/bk-arena.jpg",
      (baseTex) => {
        if (engineDisposed) return

        baseTex.colorSpace = THREE.SRGBColorSpace
        baseTex.generateMipmaps = true
        baseTex.minFilter = THREE.LinearMipmapLinearFilter
        baseTex.magFilter = THREE.LinearFilter

        PHOTO_CFG.forEach((cfg, i) => {
          // Clone for mid/near layers so each has independent UV offset
          const t = i === 0 ? baseTex : baseTex.clone()
          if (i > 0) t.needsUpdate = true
          t.offset.set(cfg.ox, cfg.oy)
          t.repeat.set(cfg.rx, cfg.ry)

          const mat = photoLayerMats[i]
          mat.map = t
          mat.opacity = cfg.maxOp
          // Night-depth tint: far layers get cool blue; near is full-color
          if (i === 0) mat.color.set(0x1e3055)      // deep navy atmosphere
          else if (i === 1) mat.color.set(0x7799bb)  // cooler mid tone
          else mat.color.set(0xffffff)               // crisp full-color entrance
          mat.needsUpdate = true
        })
      },
      undefined,
      () =>
        console.info(
          "[ThreeEngine] /images/bk-arena.jpg not found — photo layers disabled",
        ),
    )

    // ══════════════════════════════════════════════════════════════════════
    // INTERIOR GROUP  (initially invisible, fades in at 180–200 vh)
    // ══════════════════════════════════════════════════════════════════════
    const interior = new THREE.Group()

    const makeInterior = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.9,
        transparent: true,
        opacity: 0,
      })

    // Floor
    {
      const geo = new THREE.CircleGeometry(42, 48)
      const mat = makeInterior(0x05050f)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = -Math.PI / 2
      mesh.position.y = 0.02
      interior.add(mesh)
    }

    // Stage platform
    {
      const geo = new THREE.CylinderGeometry(5.5, 5.5, 0.45, 32)
      const mat = makeInterior(0x0e0e22)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 0.22, 0)
      interior.add(mesh)
    }

    // Ceiling structural ring
    {
      const geo = new THREE.TorusGeometry(20, 0.55, 8, 56)
      const mat = makeInterior(0x181828)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = 24
      mesh.rotation.x = Math.PI / 2
      interior.add(mesh)
    }

    // Radial ceiling trusses (8 struts from ring to center)
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i
      const geo = new THREE.CylinderGeometry(0.15, 0.15, 20, 6)
      const mat = makeInterior(0x121222)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(Math.cos(angle) * 10, 24, Math.sin(angle) * 10)
      mesh.rotation.z = Math.PI / 2
      mesh.rotation.y = angle
      interior.add(mesh)
    }

    // ── 3 Volumetric Spotlight Cones ─────────────────────────────────────
    const SPOT_COLORS = [0x4477ff, 0xff4444, 0xffffff]
    const SPOT_OFFSETS: [number, number, number][] = [
      [-15, 12.5, -8],
      [15, 12.5, -8],
      [0, 12.5, 12],
    ]
    const spotConeMats: THREE.MeshBasicMaterial[] = []

    SPOT_OFFSETS.forEach(([x, y, z], i) => {
      const geo = new THREE.CylinderGeometry(0.4, 6, 25, 12, 1, true)
      const mat = new THREE.MeshBasicMaterial({
        color: SPOT_COLORS[i],
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      interior.add(mesh)
      spotConeMats.push(mat)
    })

    // ── Stadium Crowd: 8000 particles  (1 draw call) ─────────────────────
    const CROWD_COUNT = 8000
    const crowdPositions = new Float32Array(CROWD_COUNT * 3)
    const crowdColorsBase = new Float32Array(CROWD_COUNT * 3)
    const crowdColorsCurrent = new Float32Array(CROWD_COUNT * 3)

    const crowdPalette = [
      [1.0, 0.95, 0.8],
      [1.0, 0.75, 0.22],
      [0.32, 0.52, 1.0],
      [1.0, 0.3, 0.3],
      [0.82, 0.82, 1.0],
    ]
    const RINGS = 20
    const perRing = Math.floor(CROWD_COUNT / RINGS)
    let pi = 0
    for (let r = 0; r < RINGS; r++) {
      const ringR = 16 + r * 1.5
      const ringH = 1 + r * 1.2
      const count = r === RINGS - 1 ? CROWD_COUNT - pi : perRing
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.12
        const jitter = (Math.random() - 0.5) * 0.75
        crowdPositions[pi * 3] = Math.cos(angle) * (ringR + jitter)
        crowdPositions[pi * 3 + 1] = ringH + Math.random() * 0.35
        crowdPositions[pi * 3 + 2] = Math.sin(angle) * (ringR + jitter)
        const col = crowdPalette[Math.floor(Math.random() * crowdPalette.length)]
        const b = 0.4 + Math.random() * 0.6
        crowdColorsBase[pi * 3] = col[0] * b
        crowdColorsBase[pi * 3 + 1] = col[1] * b
        crowdColorsBase[pi * 3 + 2] = col[2] * b
        pi++
      }
    }
    crowdColorsCurrent.set(crowdColorsBase)

    const crowdGeo = new THREE.BufferGeometry()
    crowdGeo.setAttribute("position", new THREE.BufferAttribute(crowdPositions, 3))
    const crowdColorAttr = new THREE.BufferAttribute(crowdColorsCurrent, 3)
    crowdGeo.setAttribute("color", crowdColorAttr)
    const crowdMat = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    interior.add(new THREE.Points(crowdGeo, crowdMat))

    // Collect interior materials for fade-in
    const interiorMats: THREE.Material[] = [crowdMat]
    interior.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        interiorMats.push(...mats)
      }
    })

    scene.add(interior)

    // ══════════════════════════════════════════════════════════════════════
    // INTERIOR PHOTO ASSETS  (backdrop + crowd billboards — lazily mounted)
    // ══════════════════════════════════════════════════════════════════════
    // Tracked separately from interiorMats so opacity can be capped below 1.0
    const interiorPhotoItems: Array<{ mat: THREE.MeshBasicMaterial; maxOp: number }> = []

    // ── Panoramic arena backdrop  (bk-arena-interior1.jpg) ───────────────
    // BackSide CylinderGeometry creates an immersive wrap visible from inside
    new THREE.TextureLoader().load(
      "/images/bk-arena-interior1.jpg",
      (tex) => {
        if (engineDisposed) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.wrapS = THREE.RepeatWrapping
        tex.repeat.set(2, 1)     // tile twice around circumference
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter

        const geo = new THREE.CylinderGeometry(34, 34, 26, 48, 1, true)
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          opacity: 0,
          side: THREE.BackSide,   // render inside-out — visible from center
          depthWrite: false,
          color: 0x4466aa,        // cool night-blue tint over the photo
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(0, 13, 0)
        interior.add(mesh)
        interiorPhotoItems.push({ mat, maxOp: 0.62 })
      },
      undefined,
      () => console.info("[ThreeEngine] bk-arena-interior1.jpg not found"),
    )

    // ── Crowd photo billboard ring  (crowd.webp) ─────────────────────────
    // 8 wide planes × 2 seating tiers, each showing a different horizontal
    // slice of the crowd photo — blends with particle system for depth
    new THREE.TextureLoader().load(
      "/images/crowd.webp",
      (baseTex) => {
        if (engineDisposed) return
        baseTex.colorSpace = THREE.SRGBColorSpace

        // [radius, y, uvOffsetY, uvRepeatY]
        const TIERS: [number, number, number, number][] = [
          [18, 2.8, 0.0,  0.62],   // lower tier: bottom 62% of photo
          [22, 7.2, 0.38, 0.62],   // upper tier: top 62% of photo
        ]
        const PER_RING = 8

        TIERS.forEach(([r, y, uvOffY, uvRepY]) => {
          for (let i = 0; i < PER_RING; i++) {
            const angle = (Math.PI * 2 / PER_RING) * i
            const x = Math.sin(angle) * r
            const z = Math.cos(angle) * r

            const t = baseTex.clone()
            t.needsUpdate = true
            // Each billboard shows a different 37.5% horizontal slice
            t.offset.set((i / PER_RING) * 0.625, uvOffY)
            t.repeat.set(0.375, uvRepY)

            const geo = new THREE.PlaneGeometry(7.5, 4.4)
            const mat = new THREE.MeshBasicMaterial({
              map: t,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              alphaTest: 0.02,
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(x, y, z)
            mesh.lookAt(0, y, 0)   // always faces the camera at arena center
            interior.add(mesh)
            interiorPhotoItems.push({ mat, maxOp: 0.82 })
          }
        })
      },
      undefined,
      () => console.info("[ThreeEngine] crowd.webp not found"),
    )

    // ══════════════════════════════════════════════════════════════════════
    // PENTAGON SCREEN ARRAY
    // ══════════════════════════════════════════════════════════════════════
    interface ScreenEntry {
      mesh: THREE.Mesh
      mat: THREE.MeshStandardMaterial
      light: THREE.PointLight
      dimTex: THREE.CanvasTexture
      brightTex: THREE.CanvasTexture
      era: EraData
      video: HTMLVideoElement | null
      videoTex: THREE.VideoTexture | null
      hasVideo: boolean
    }

    const screens: ScreenEntry[] = []

    ERAS.forEach((era, i) => {
      const angle = ((Math.PI * 2) / 5) * i
      const x = Math.sin(angle) * SCREEN_RADIUS
      const z = -Math.cos(angle) * SCREEN_RADIUS

      const dimTex = buildScreenTexture(era, false)
      const brightTex = buildScreenTexture(era, true)

      const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H)
      const screenMat = new THREE.MeshStandardMaterial({
        map: dimTex,
        emissive: new THREE.Color(era.accent),
        emissiveIntensity: 0,
        roughness: 0.45,
        metalness: 0.12,
        transparent: true,
        opacity: 0,
      })
      const screenMesh = new THREE.Mesh(screenGeo, screenMat)
      screenMesh.position.set(x, CAM_Y + 0.3, z)
      // Face inward toward the camera at origin: rotation.y = -angle
      screenMesh.rotation.y = -angle

      const pointLight = new THREE.PointLight(era.accent, 0, 16)
      pointLight.position.set(x * 0.65, CAM_Y + 0.5, z * 0.65)

      scene.add(screenMesh, pointLight)
      screens.push({
        mesh: screenMesh,
        mat: screenMat,
        light: pointLight,
        dimTex,
        brightTex,
        era,
        video: null,
        videoTex: null,
        hasVideo: false,
      })
    })

    // ══════════════════════════════════════════════════════════════════════
    // VIDEO TEXTURE SYSTEM
    // ══════════════════════════════════════════════════════════════════════
    // Drop  public/videos/era-2006.mp4 … era-2022.mp4  (720p H.264, 15–30s loops)
    // Only the ACTIVE screen's video plays at any time — all others are paused,
    // costing zero GPU frame-upload overhead. Muted autoplay is universally
    // permitted by browsers, so no gesture is needed to start the video.
    // Falls back cleanly to canvas textures if any file is missing.
    //
    // Audio: if your MP4 files include an audio track it replaces the era's
    // separate .mp3 automatically — the audio track's volume is set to 0
    // when a video is present to avoid double-playback.

    const isMobileDevice = window.innerWidth < 768

    if (!isMobileDevice) {
      screens.forEach((s, i) => {
        const video = document.createElement("video")
        video.src = `/videos/era-${s.era.year}.mp4`
        video.loop = true
        video.muted = true       // required for autoplay; unmuted when audio-enabled
        video.playsInline = true
        video.preload = "auto"
        video.crossOrigin = "anonymous"

        const videoTex = new THREE.VideoTexture(video)
        videoTex.colorSpace = THREE.SRGBColorSpace
        videoTex.minFilter = THREE.LinearFilter
        videoTex.magFilter = THREE.LinearFilter

        s.video = video
        s.videoTex = videoTex

        // On first playable frame: populate VideoTexture then pause unless active
        video.addEventListener(
          "canplay",
          () => {
            if (engineDisposed) return
            s.hasVideo = true
            // Muted autoplay is allowed everywhere — grab first frame
            video.play()
              .then(() => {
                requestAnimationFrame(() => {
                  if (currentEra !== i) video.pause()

                  // Make the screen self-emissive like a real LED display:
                  // diffuse map   → correct colors under light
                  // emissiveMap   → screen glows at its own color regardless of scene light
                  // emissive      → white multiplier so video colors pass through unchanged
                  // emissiveIntensity 0.12 when idle (dim poster), 1.0 when active
                  s.mat.map = videoTex
                  s.mat.emissiveMap = videoTex
                  s.mat.emissive.set(0xffffff)
                  s.mat.emissiveIntensity = currentEra === i ? 1.0 : 0.12
                  s.mat.needsUpdate = true
                })
              })
              .catch(() => { s.hasVideo = false })
          },
          { once: true },
        )

        video.addEventListener("error", () => { s.hasVideo = false })
        video.load()
      })
    }

    // ══════════════════════════════════════════════════════════════════════
    // AUDIO MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════
    let audioEnabled = false
    const audioTracks = ERAS.map((_, i) => {
      const a = new Audio(`/audio/era-${i + 1}.mp3`)
      a.loop = true
      a.volume = 0
      a.preload = "none"
      return a
    })

    // Audio is enabled by default — starts on the first user interaction.
    // Browsers require a gesture before allowing audio; scroll is sufficient.
    const startAllTracks = () => {
      audioEnabled = true
      audioTracks.forEach((a) => a.play().catch(() => {}))
    }

    const unlockAudio = () => {
      startAllTracks()
      // Keep the manual button event alive so it still works as a toggle
    }

    // Try immediately (succeeds when the browser already has a gesture context)
    // If it throws, fall back to first-scroll unlock
    const immediateAttempt = audioTracks[0]?.play()
    if (immediateAttempt) {
      immediateAttempt
        .then(() => {
          // Immediate play worked — start the rest
          audioEnabled = true
          audioTracks.slice(1).forEach((a) => a.play().catch(() => {}))
        })
        .catch(() => {
          // Blocked — unlock on first scroll, click, or keydown
          window.addEventListener("scroll", unlockAudio, { once: true })
          window.addEventListener("pointerdown", unlockAudio, { once: true })
          window.addEventListener("keydown", unlockAudio, { once: true })
        })
    }

    // Manual override (fires if auto-start was blocked)
    const onAudioEnable = () => startAllTracks()
    window.addEventListener("audio-enable", onAudioEnable)

    // Mute toggle — flips the muted flag on all tracks without losing volumes
    let audioMuted = false
    const onAudioMuteToggle = () => {
      audioMuted = !audioMuted
      audioTracks.forEach((a) => { a.muted = audioMuted })
      // Also mute/unmute whichever era video is currently playing
      screens.forEach((s) => {
        if (s.video && !s.video.paused) s.video.muted = audioMuted
      })
    }
    window.addEventListener("audio-toggle-mute", onAudioMuteToggle)

    const fadeIntervals: ReturnType<typeof setInterval>[] = []

    function crossfadeAudio(targetIdx: number) {
      if (!audioEnabled) return
      fadeIntervals.forEach(clearInterval)
      fadeIntervals.length = 0
      audioTracks.forEach((track, i) => {
        // If this era has a loaded video the MP4 audio track handles playback
        const videoOwnsAudio = screens[i]?.hasVideo ?? false
        const goal = i === targetIdx && !videoOwnsAudio ? 0.65 : 0
        const id = setInterval(() => {
          const delta = goal - track.volume
          if (Math.abs(delta) < 0.02) {
            track.volume = goal
            clearInterval(id)
          } else {
            track.volume = Math.max(0, Math.min(1, track.volume + delta * 0.12))
          }
        }, 40)
        fadeIntervals.push(id)
      })
    }

    // ══════════════════════════════════════════════════════════════════════
    // ERA ACTIVATION
    // ══════════════════════════════════════════════════════════════════════
    let currentEra = -1

    function activateEra(idx: number) {
      if (idx === currentEra) return
      currentEra = idx

      screens.forEach((s, i) => {
        const active = i === idx

        if (s.hasVideo && s.video) {
          // ── Video path ────────────────────────────────────────────────
          if (active) {
            // Unmute only if audio is globally enabled and not muted
            s.video.muted = audioMuted || !audioEnabled
            s.video.play().catch(() => {})
          } else {
            s.video.pause()
            s.video.muted = true
          }
          // mat.map stays as videoTex — paused frame acts as a still preview
        } else {
          // ── Canvas fallback ───────────────────────────────────────────
          const target = active ? s.brightTex : s.dimTex
          if (s.mat.map !== target) {
            s.mat.map = target
            s.mat.needsUpdate = true
          }
        }

        gsap.to(s.mat, {
          // Video screens: 1.0 = full LED brightness, 0.12 = dim poster preview
          // Canvas screens: 0.38 = accent glow, 0 = off
          emissiveIntensity: active
            ? (s.hasVideo ? 1.0  : 0.38)
            : (s.hasVideo ? 0.12 : 0),
          duration: 0.45,
          ease: "power2.out",
        })
        gsap.to(s.light, {
          intensity: active ? 2.8 : 0,
          duration: 0.45,
          ease: "power2.out",
        })
        // Accent-color tint the closest spotlight cone
        if (active && spotConeMats[i % spotConeMats.length]) {
          gsap.to(spotConeMats[i % spotConeMats.length].color, {
            r: new THREE.Color(s.era.accent).r,
            g: new THREE.Color(s.era.accent).g,
            b: new THREE.Color(s.era.accent).b,
            duration: 0.6,
          })
        }
      })

      if (idx < ERAS.length) {
        window.dispatchEvent(
          new CustomEvent("era-change", { detail: { era: idx } }),
        )
        window.dispatchEvent(
          new CustomEvent("subtitle-change", {
            detail: { text: ERAS[idx].subtitle },
          }),
        )
        crossfadeAudio(idx)
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    // GSAP SCROLL TRIGGERS
    // ══════════════════════════════════════════════════════════════════════
    const H = window.innerHeight

    // ── ACT I  0vh → 200vh: camera Z-axis flight ─────────────────────────
    ScrollTrigger.create({
      start: 0,
      end: H * 2,
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress

        // Camera approaches building
        camera.position.z = CAM_START_Z * (1 - p)

        // Title fade (first 40% of scroll)
        const titleEl = document.getElementById("act1-title")
        if (titleEl) titleEl.style.opacity = String(Math.max(0, 1 - p * 2.8))

        // Scroll prompt fades immediately
        const promptEl = document.getElementById("scroll-prompt")
        if (promptEl) promptEl.style.opacity = String(Math.max(0, 1 - p * 6))

        // Phase-through dissolve: starts when camera approaches front face (~z=17)
        // That is when p ≈ (40-17)/40 = 0.575
        const dissolveP = Math.max(0, Math.min(1, (p - 0.55) / 0.45))

        exteriorMats.forEach((m) => {
          ;(m as THREE.Material & { opacity: number }).opacity = 1 - dissolveP
        })
        // Photo parallax layers fade out with the exterior
        PHOTO_CFG.forEach((cfg, i) => {
          photoLayerMats[i].opacity = cfg.maxOp * (1 - dissolveP)
        })
        interiorMats.forEach((m) => {
          ;(m as THREE.Material & { opacity: number }).opacity = dissolveP
        })
        // Photo backdrop + crowd billboards — capped at each asset's maxOp
        interiorPhotoItems.forEach(({ mat, maxOp }) => {
          mat.opacity = maxOp * dissolveP
        })
        spotConeMats.forEach((m) => {
          m.opacity = dissolveP * 0.1
        })
        screens.forEach((s) => {
          s.mat.opacity = dissolveP
        })
      },
    })

    // Show HUD just before entering interior
    ScrollTrigger.create({
      start: H * 1.85,
      onEnter() {
        window.dispatchEvent(
          new CustomEvent("hud-visible", { detail: { visible: true } }),
        )
        activateEra(0)
      },
      onLeaveBack() {
        window.dispatchEvent(
          new CustomEvent("hud-visible", { detail: { visible: false } }),
        )
        currentEra = -1
      },
    })

    // ── ACT II  200vh → 500vh: Y-axis 360° rotation + era panels ─────────
    ScrollTrigger.create({
      start: H * 2,
      end: H * 5,
      scrub: 1.5,
      onUpdate(self) {
        const p = self.progress
        // Smooth 360° sweep clockwise: 0 → -2π
        camera.rotation.y = -p * Math.PI * 2

        // Activate the era the camera is currently facing
        // Each era occupies 1/5 of the total progress range
        const eraIdx = Math.min(4, Math.floor(p * 5))
        activateEra(eraIdx)
      },
    })

    // ── ACT III transition at 500vh: BK Arena dot + final subtitle ────────
    ScrollTrigger.create({
      start: H * 5,
      onEnter() {
        window.dispatchEvent(
          new CustomEvent("era-change", { detail: { era: 5 } }),
        )
        window.dispatchEvent(
          new CustomEvent("subtitle-change", {
            detail: { text: "BK ARENA · 2026 — YOU HAVE ARRIVED" },
          }),
        )
        // Kill all screen lights
        screens.forEach((s) => {
          gsap.to(s.light, { intensity: 0, duration: 1.5 })
        })
      },
      onLeaveBack() {
        activateEra(4)
      },
    })

    // ── ACT III  500vh → 600vh: terminal overlay fade ─────────────────────
    ScrollTrigger.create({
      start: H * 5,
      end: H * 6,
      scrub: 1,
      onUpdate(self) {
        window.dispatchEvent(
          new CustomEvent("terminal-progress", {
            detail: { progress: self.progress },
          }),
        )
      },
    })

    // ══════════════════════════════════════════════════════════════════════
    // RENDER LOOP
    // ══════════════════════════════════════════════════════════════════════
    let rafId = 0
    let frame = 0
    const startTime = performance.now()

    function tick() {
      rafId = requestAnimationFrame(tick)
      frame++
      const t = (performance.now() - startTime) / 1000

      // City flicker (cheap sine)
      cityMat.opacity = 0.72 + Math.sin(t * 2.3) * 0.14

      // Crowd twinkle: update 60 random particles per frame
      if (crowdMat.opacity > 0.05) {
        for (let k = 0; k < 60; k++) {
          const idx = Math.floor(Math.random() * CROWD_COUNT)
          const flicker = 0.3 + Math.random() * 0.7
          crowdColorAttr.setXYZ(
            idx,
            crowdColorsBase[idx * 3] * flicker,
            crowdColorsBase[idx * 3 + 1] * flicker,
            crowdColorsBase[idx * 3 + 2] * flicker,
          )
        }
        crowdColorAttr.needsUpdate = true
      }

      // Slow spotlight rotation
      interior.children.forEach((obj, i) => {
        if (
          obj instanceof THREE.Mesh &&
          (obj.material as THREE.Material).transparent &&
          (obj.material as THREE.MeshBasicMaterial).side === THREE.DoubleSide
        ) {
          obj.rotation.y = t * 0.28 * (i % 2 === 0 ? 1 : -1)
        }
      })

      renderer.render(scene, camera)
    }

    tick()

    // ── Resize ──────────────────────────────────────────────────────────
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(
        window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 2),
      )
    }
    window.addEventListener("resize", onResize)

    // ══════════════════════════════════════════════════════════════════════
    // CLEANUP
    // ══════════════════════════════════════════════════════════════════════
    return () => {
      engineDisposed = true   // prevent async TextureLoader callback from firing
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("audio-enable", onAudioEnable)
      window.removeEventListener("audio-toggle-mute", onAudioMuteToggle)
      window.removeEventListener("scroll", unlockAudio)
      window.removeEventListener("pointerdown", unlockAudio)
      window.removeEventListener("keydown", unlockAudio)
      fadeIntervals.forEach(clearInterval)

      ScrollTrigger.getAll().forEach((t) => t.kill())

      scene.traverse((obj) => {
        if (
          obj instanceof THREE.Mesh ||
          obj instanceof THREE.Points ||
          obj instanceof THREE.LineSegments
        ) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          mats.forEach((m) => {
            const std = m as THREE.MeshStandardMaterial
            if (std.map) std.map.dispose()
            // emissiveMap on video screens points to the same VideoTexture as map —
            // null it out so the VideoTexture isn't double-disposed below
            if (std.emissiveMap && std.emissiveMap !== std.map) std.emissiveMap.dispose()
            m.dispose()
          })
        }
      })

      screens.forEach((s) => {
        s.dimTex.dispose()
        s.brightTex.dispose()
        if (s.videoTex) s.videoTex.dispose()
        if (s.video) {
          s.video.pause()
          s.video.removeAttribute("src")
          s.video.load()   // releases the media resource
        }
      })
      arenaTextTex.dispose()
      renderer.dispose()

      audioTracks.forEach((a) => {
        a.pause()
        a.src = ""
      })
    }
  }, [])

  return null
}
