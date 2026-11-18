import React from "react"
import { FaDumbbell } from "react-icons/fa"

/**
 * Blocks the Lyfta sections share, sized in fixed pixels so `calculateHeight` in
 * index.tsx can add them up: a tile is LYFTA_TILE_HEIGHT tall, an exercise row
 * LYFTA_ROW_HEIGHT. Change one here and the constants there move with it.
 */

/** A metric tile: label over value, the look of the Steam and Last.fm statistics. */
export function StatTile({ label, value }: { label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 h-[60px] half:h-[56px] px-2 rounded-lg border border-solid border-default-border bg-default-muted/10 overflow-hidden">
      <p className="text-[10px] leading-none font-bold uppercase tracking-wider text-default-muted whitespace-nowrap">
        {label}
      </p>
      <p className="text-xl half:text-lg leading-none font-bold text-default-highlight tabular-nums whitespace-nowrap">
        {value}
      </p>
    </div>
  )
}

/** The tiles in a grid: two per row in half, all in one row in full. */
export function StatTiles({
  children,
  count,
  size,
  className,
  style,
}: {
  children: React.ReactNode
  count: number
  size: "half" | "full"
  className?: string
  style?: React.CSSProperties
}): React.ReactElement {
  const columns = size === "half" ? Math.min(count, 2) : count
  return (
    <div
      className={`grid gap-2 ${className ?? ""}`}
      style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))`, ...style }}
    >
      {children}
    </div>
  )
}

/** The exercise image, or a dumbbell in the same square so the names stay aligned. */
export function ExerciseThumb({ image, alt }: { image: string | null | undefined; alt: string }): React.ReactElement {
  return image ? (
    <img src={image} alt={alt} width={36} height={36} className="w-9 h-9 flex-shrink-0 rounded-md object-contain" />
  ) : (
    <div className="w-9 h-9 flex-shrink-0 rounded-md bg-default-muted/10 flex items-center justify-center text-default-muted">
      <FaDumbbell />
    </div>
  )
}

/** One exercise: thumb, name over detail, value over caption on the right. 44px tall. */
export function ExerciseRow({
  image,
  showImage = true,
  name,
  detail,
  value,
  caption,
  accent = false,
}: {
  image?: string | null
  showImage?: boolean
  name: string
  detail: string
  value: string
  caption?: string
  /** The value in the highlight colour, for the number the section is about. */
  accent?: boolean
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2.5 h-[44px]">
      {showImage && <ExerciseThumb image={image} alt={name} />}
      <div className="flex-1 min-w-0">
        <p className="text-sm half:text-[13px] leading-5 font-semibold text-default-text truncate">{name}</p>
        <p className="text-xs half:text-[11px] leading-4 text-default-muted truncate">{detail}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p
          className={`text-sm half:text-[13px] leading-5 font-bold tabular-nums whitespace-nowrap ${
            accent ? "text-default-highlight" : "text-default-text"
          }`}
        >
          {value}
        </p>
        {caption && <p className="text-[10px] leading-4 text-default-muted whitespace-nowrap">{caption}</p>}
      </div>
    </div>
  )
}

/** Muscle groups as chips, one line: the rest folds into "+N". */
export function MuscleChips({ muscles, max }: { muscles: string[]; max: number }): React.ReactElement {
  const shown = muscles.slice(0, max)
  return (
    <div className="flex gap-1 overflow-hidden h-[18px]">
      {shown.map((muscle) => (
        <span
          key={muscle}
          className="flex-shrink-0 px-2 h-[18px] leading-[18px] rounded-full text-[10px] font-medium text-default-highlight bg-default-15 whitespace-nowrap"
        >
          {muscle}
        </span>
      ))}
      {muscles.length > shown.length && (
        <span className="flex-shrink-0 h-[18px] leading-[18px] text-[10px] text-default-muted">
          +{muscles.length - shown.length}
        </span>
      )}
    </div>
  )
}
