import React from "react"
import { FaTags } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { DevToConfig, DevToTag } from "../types"

interface TopTagsProps {
  tags: DevToTag[]
  config: DevToConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** Mantido em sincronia com calculateHeight em index.tsx. */
export const TAG_CHIP_HEIGHT = 24
export const TAG_CHIPS_PER_ROW = { half: 3, full: 6 } as const
export const TAG_ROW_GAP = 6

export function TopTags({ tags, config, style = "default", size = "half" }: TopTagsProps): React.ReactElement {
  // As tags são derivadas da janela de artigos; sem artigos não há tags, e a seção
  // some em vez de mostrar um bloco vazio.
  if (!tags || tags.length === 0) return <></>

  const hideTitle = config.top_tags_hide_title === true || config.top_tags_hide_title === "true"
  // O rótulo diz "recent" de propósito: isto conta a janela buscada, não o
  // histórico -- a API não expõe totais sem paginar tudo.
  const title = config.top_tags_title || "Top Tags (recent posts)"
  const shown = tags.slice(0, config.top_tags_max ?? 8)

  return (
    <section id="devto-top-tags">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaTags />} />}
            <div className="flex flex-wrap" style={{ gap: `${TAG_ROW_GAP}px` }}>
              {shown.map((tag) => (
                <span
                  key={tag.name}
                  className="text-xs px-2 rounded bg-default-surface text-default-text flex items-center"
                  style={{ height: `${TAG_CHIP_HEIGHT}px` }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "devto", section: "top_tags", size })} />
            {shown.map((tag) => (
              <TerminalLineWithDots key={tag.name} title={`#${tag.name}`} value={String(tag.count)} />
            ))}
          </>
        }
      />
    </section>
  )
}
