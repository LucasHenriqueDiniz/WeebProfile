/**
 * AnimatedNumber - a number that counts up from 0 when card animations are on.
 *
 * The digits on screen while it counts are a pseudo-element laid over the real text
 * (styles/animations.ts), which stays in the DOM and only goes see-through while the
 * count runs. When the count ends both effects stop applying, so the number at rest is
 * the real text, exactly as with animations off.
 *
 * A CSS counter only prints integers, so "12.3K" counts 0K..12K and then settles on
 * the real "12.3K". Anything that is not a plain number is left alone.
 */

import React from "react"
import { useAnimations } from "./animations"

const NUMBER = /^(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?([KMBT%]?)$/

/** Integer to count to and the unit printed after it, or null for text that is not a number. */
export function parseCountTarget(text: string): { to: number; unit: string } | null {
  const match = NUMBER.exec(text.trim())
  if (!match?.[1]) return null
  const to = Number(match[1].replace(/,/g, ""))
  if (!Number.isSafeInteger(to) || to <= 0) return null
  return { to, unit: match[2] ?? "" }
}

export function AnimatedNumber({ value }: { value: string | number }): React.ReactElement {
  const animations = useAnimations()
  const text = String(value)
  const target = animations ? parseCountTarget(text) : null
  if (!target) return <>{text}</>

  return (
    <span
      className="weeb-num"
      style={
        {
          "--weeb-to": target.to,
          ...(target.unit ? { "--weeb-unit": JSON.stringify(target.unit) } : {}),
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  )
}
