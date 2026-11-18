/**
 * AnimatedNumber - a number that counts up from 0 when card animations are on.
 *
 * The digits on screen while it counts are a pseudo-element laid over the real text
 * (styles/animations.ts), which stays in the DOM and only goes see-through while the
 * count runs. When the count ends both effects stop applying, so the number at rest is
 * the real text, exactly as with animations off.
 *
 * A CSS counter only prints integers, so a number with decimals counts as an integer
 * scaled by 10^decimals: "68.2" counts 0..682 and prints the integer part, a dot and the
 * decimal part, "0.0" up to "68.2". Text with more decimals than the counter prints, or
 * anything that is not a plain number, is left alone rather than counted wrong.
 */

import React from "react"
import { useAnimations } from "./animations"

/** Decimals the counter prints; the stylesheet has a content rule for each. */
export const MAX_COUNT_DECIMALS = 2

/**
 * Largest value counted (the integer, decimals included). Above 2^23 Firefox 150 gets the
 * last digit of round() wrong: it printed 8388609 and 16777215 as other numbers, so the
 * count would not land on the text. Measured exact up to it, and in Chromium and WebKit.
 */
const MAX_COUNT = 2 ** 23

// An optional "#" before the number (a rank) and one word after it ("123 days").
const NUMBER = /^(#?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?([KkMBT%]?)( [A-Za-z]+)?$/

export interface CountTarget {
  /** Value to count to, as an integer: the number times 10^decimals. */
  to: number
  /** Digits after the dot, printed while counting as they are in the text. */
  decimals: number
  /** Printed before the number ("#"). */
  prefix: string
  /** Printed after the number ("K", "%", " days"). */
  unit: string
}

/** What to count to, or null for text that is not a number the counter can print as is. */
export function parseCountTarget(text: string): CountTarget | null {
  const match = NUMBER.exec(text.trim())
  if (!match?.[2]) return null
  const fraction = match[3] ?? ""
  if (fraction.length > MAX_COUNT_DECIMALS) return null
  const to = Number(match[2].replace(/,/g, "") + fraction)
  if (!Number.isSafeInteger(to) || to <= 0 || to > MAX_COUNT) return null
  return { to, decimals: fraction.length, prefix: match[1] ?? "", unit: (match[4] ?? "") + (match[5] ?? "") }
}

export function AnimatedNumber({ value }: { value: string | number }): React.ReactElement {
  const animations = useAnimations()
  const text = String(value)
  const target = animations ? parseCountTarget(text) : null
  if (!target) return <>{text}</>

  return (
    <span
      className={target.decimals ? `weeb-num weeb-num-${target.decimals}` : "weeb-num"}
      style={
        {
          "--weeb-to": target.to,
          ...(target.decimals ? { "--weeb-scale": 10 ** target.decimals } : {}),
          ...(target.prefix ? { "--weeb-prefix": JSON.stringify(target.prefix) } : {}),
          ...(target.unit ? { "--weeb-unit": JSON.stringify(target.unit) } : {}),
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  )
}
