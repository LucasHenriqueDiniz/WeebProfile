"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export function LoadingAnimation() {
  const frames = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `/sora/loading/loading${String(i).padStart(2, "0")}.webp`),
    []
  )

  const [idx, setIdx] = useState(0)
  const loaded = useRef(false)

  useEffect(() => {
    // Preload (roda uma vez)
    if (loaded.current) return
    loaded.current = true

    for (const src of frames) {
      const img = new Image()
      img.decoding = "async"
      img.src = src
    }
  }, [frames])

  useEffect(() => {
    // 8 fps = 125ms. 10 fps = 100ms
    const fps = 8
    const interval = Math.round(1000 / fps)

    const t = window.setInterval(() => {
      setIdx((v) => (v + 1) % frames.length)
    }, interval)

    return () => window.clearInterval(t)
  }, [frames.length])

  return (
    <img
      src={frames[idx]}
      alt="Loading"
      width={256}
      height={256}
      draggable={false}
      className="pixelated"
      style={{
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  )
}



















