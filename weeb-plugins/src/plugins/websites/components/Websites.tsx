import React from "react"
import { FaGlobe } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLine } from "../../../templates/Terminal/TerminalLine"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import { WebsitesFeatured } from "./WebsitesFeatured"
import { WebsitesGrid } from "./WebsitesGrid"
import { WebsitesList } from "./WebsitesList"
import type { WebsitesData, WebsitesNonEssentialConfig, WebsitesVariant } from "../types"

interface WebsitesProps {
  data: WebsitesData
  config: WebsitesNonEssentialConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function Websites({ data, config, style = "default", size = "half" }: WebsitesProps): React.ReactElement {
  const websites = data?.websites ?? []
  if (websites.length === 0) return <></>

  const hideTitle = config.websites_hide_title || false
  const title = config.websites_title || "Websites"
  const variant = (config.websites_variant || "grid") as WebsitesVariant
  const showThumbnail = config.websites_show_thumbnail !== false
  const showDescription = config.websites_show_description !== false

  const defaultBody =
    variant === "list" ? (
      <WebsitesList websites={websites} size={size} showDescription={showDescription} />
    ) : variant === "featured" ? (
      <WebsitesFeatured
        websites={websites}
        size={size}
        showThumbnail={showThumbnail}
        showDescription={showDescription}
      />
    ) : (
      <WebsitesGrid websites={websites} size={size} showThumbnail={showThumbnail} showDescription={showDescription} />
    )

  return (
    <section id="websites-showcase">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaGlobe />} />}
            {defaultBody}
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "websites",
                section: "websites",
                limit: websites.length,
                size,
              })}
            />
            {/* No terminal as três variantes colapsam numa lista só. TerminalLine
                é usado no lugar de TerminalGrid porque suas duas colunas truncam:
                a coluna de valor do grid é `whitespace-nowrap` e um domínio longo
                estoura a largura do card.

                O `pr-2` compensa o `.terminal-body` (px-2 sobre um elemento
                `w-full`), que é 16px mais largo que o SVG em todos os plugins:
                sem ele o último caractere do domínio fica fora da área visível. */}
            {websites.map((site) => (
              <TerminalLine key={site.url} right={site.title} left={site.domain} className={{ left: "pr-2" }} />
            ))}
          </>
        }
      />
    </section>
  )
}
