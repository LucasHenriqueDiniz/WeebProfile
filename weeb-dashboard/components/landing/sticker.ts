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

/** The main action at the size of a toolbar (the signed-in app's headers and cards). */
export const BUTTON_PRIMARY_SM =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-foreground bg-cyan-400 px-3.5 text-[13px] font-bold text-slate-950 shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-all hover:translate-x-px hover:translate-y-px hover:bg-cyan-300 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

export const BUTTON_SECONDARY_SM =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border-2 border-foreground bg-card px-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"

/** An icon-only button: no border until hovered, so a row of them stays quiet. */
export const BUTTON_ICON =
  "inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg border-2 border-transparent text-muted-foreground transition-colors hover:border-foreground hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

/** A segmented control's frame and its segments (the public header's nav, the style toggle). */
export const SEGMENTED = "inline-flex items-center rounded-xl border-2 border-foreground bg-card p-0.5"
export const segment = (active: boolean) =>
  `inline-flex items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
    active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
  }`

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
