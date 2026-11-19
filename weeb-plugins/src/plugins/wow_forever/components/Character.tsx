import React from "react"
import { GiCrossedSwords } from "react-icons/gi"
import { useItemCascade } from "../../../templates/animations"
import {
  RENDER_CROP,
  RENDER_SOURCE,
  characterBodyHeight,
  characterFields,
  characterImageSize,
  characterMetrics,
  characterSubtitle,
  type Size,
  type Style,
} from "../layout"
import type { WowForeverData } from "../types"
import { COLORS, WowSection, ellipsis } from "./Section"

/** Longest a label column gets before its labels end in an ellipsis. */
const LABEL_MAX_WIDTH: Record<Size, number> = { half: 96, full: 130 }

function Picture({ data, style, size }: { data: WowForeverData; style: Style; size: Size }) {
  const box = characterImageSize(style, size, data.image)
  if (!data.image || !box) return null
  const terminal = style === "terminal"
  const frame: React.CSSProperties = {
    position: "relative",
    width: `${box.width}px`,
    height: `${box.height}px`,
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: terminal ? "4px" : "12px",
    // The render has a transparent background: a dark-armored character would vanish
    // into a dark page without something behind it.
    background: terminal
      ? "var(--terminal-color-surface)"
      : "color-mix(in srgb, var(--default-color-muted) 14%, transparent)",
  }

  if (data.image.kind === "avatar") {
    return (
      <div style={frame}>
        <img
          src={data.image.src}
          alt=""
          width={box.width}
          height={box.height}
          style={{ display: "block", width: `${box.width}px`, height: `${box.height}px`, objectFit: "cover" }}
        />
      </div>
    )
  }

  // Scale the 1600x1200 render so the crop window's height fills the frame, centered on
  // the character, which renders put on the picture's vertical axis.
  const scale = box.height / RENDER_CROP.height
  const width = RENDER_SOURCE.width * scale
  const height = RENDER_SOURCE.height * scale
  const centerX = (RENDER_CROP.x + RENDER_CROP.width / 2) * scale
  return (
    <div style={frame}>
      <img
        src={data.image.src}
        alt=""
        width={Math.round(width)}
        height={Math.round(height)}
        style={{
          position: "absolute",
          display: "block",
          maxWidth: "none",
          width: `${width}px`,
          height: `${height}px`,
          left: `${box.width / 2 - centerX}px`,
          top: `${-RENDER_CROP.y * scale}px`,
        }}
      />
    </div>
  )
}

interface CharacterProps {
  data: WowForeverData
  style: Style
  size: Size
  title: string
  hideTitle: boolean
}

export function Character({ data, style, size, title, hideTitle }: CharacterProps): React.ReactElement {
  const terminal = style === "terminal"
  const m = characterMetrics(style, size)
  const colors = COLORS[style]
  const { character } = data
  const fields = characterFields(character, style)
  const cascade = useItemCascade(fields.length * 2)
  const fullName = [character.name, character.surname].filter(Boolean).join(" ")

  return (
    <WowSection
      id="wow-forever-character"
      style={style}
      title={title}
      hideTitle={hideTitle}
      icon={<GiCrossedSwords />}
      command={`wow whois ${data.slug}`}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: data.image ? `${m.imageGap}px` : 0,
          height: `${characterBodyHeight(style, size, data)}px`,
        }}
      >
        <Picture data={data} style={style} size={size} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              ...ellipsis,
              height: `${m.nameLine}px`,
              lineHeight: `${m.nameLine}px`,
              fontSize: `${m.nameFont}px`,
              fontWeight: terminal ? 600 : 700,
              color: colors.accent,
            }}
          >
            {fullName}
          </div>
          <div
            style={{
              ...ellipsis,
              height: `${m.subtitleLine}px`,
              lineHeight: `${m.subtitleLine}px`,
              fontSize: `${m.subtitleFont}px`,
              color: terminal ? "var(--terminal-color-muted-light)" : colors.muted,
            }}
          >
            {terminal ? "-".repeat(Math.max(4, [...fullName].length)) : characterSubtitle(character)}
          </div>
          {fields.length > 0 && (
            <div
              className={cascade?.className}
              style={{
                display: "grid",
                gridTemplateColumns: "max-content minmax(0, 1fr)",
                gridAutoRows: `${m.fieldLine}px`,
                columnGap: terminal ? "10px" : "14px",
                marginTop: `${m.fieldsGap}px`,
                fontSize: `${m.fieldFont}px`,
                lineHeight: `${m.fieldLine}px`,
                ...cascade?.style,
              }}
            >
              {fields.map((field) => (
                <React.Fragment key={field.label}>
                  <span
                    style={{
                      ...ellipsis,
                      maxWidth: `${LABEL_MAX_WIDTH[size]}px`,
                      fontWeight: 600,
                      color: colors.label,
                    }}
                  >
                    {terminal ? `${field.label}:` : field.label}
                  </span>
                  <span style={{ ...ellipsis, color: colors.text }}>{field.value}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </WowSection>
  )
}
