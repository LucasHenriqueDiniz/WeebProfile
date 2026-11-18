/**
 * The landing's sticker look, set by the hero: ink borders, hard offset shadows, no
 * glow and no gradient fills. The hero's own band is fixed light (slate ink on pale
 * cyan); everything below it follows the theme, so "ink" here is the foreground colour.
 */

/** A card: ink border, hard shadow in the brand purple. */
export const STICKER = "rounded-2xl border-2 border-foreground bg-card shadow-[6px_6px_0_0_hsl(var(--primary))]"

/** A card that is also a link or a button: it lifts towards the pointer. */
export const STICKER_LIFT =
  "transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** The main action: cyan, ink border, ink shadow that shortens when pressed. */
export const BUTTON_PRIMARY =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border-2 border-foreground bg-cyan-400 px-6 py-3.5 text-[15px] font-semibold text-slate-950 shadow-[4px_4px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-cyan-300 hover:shadow-[3px_3px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export const BUTTON_SECONDARY =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg border-2 border-foreground bg-background px-5 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** A small label on a card. */
export const CHIP =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-foreground/70 bg-background px-2.5 py-0.5 text-[11px] font-semibold text-foreground"

/** An icon tile: solid pastel, ink border. The pastel is the caller's (`bg-…-300`). */
export const TILE =
  "flex h-10 w-10 flex-none items-center justify-center rounded-xl border-2 border-foreground text-slate-950"

/** Screentone: a dotted patch for a corner of a panel. Position and mask are the caller's. */
export const HALFTONE =
  "pointer-events-none absolute bg-[radial-gradient(hsl(var(--foreground)/0.2)_1.5px,transparent_1.5px)] [background-size:9px_9px]"

/** Kicker and tile colours, by name. */
export const TONE = {
  cyan: "bg-cyan-300",
  pink: "bg-pink-300",
  amber: "bg-amber-300",
  lime: "bg-lime-300",
  violet: "bg-violet-300",
  sky: "bg-sky-300",
} as const
export type Tone = keyof typeof TONE
