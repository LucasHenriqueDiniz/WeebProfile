import React from "react"
import { FaComment, FaHeart, FaRegNewspaper } from "react-icons/fa"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { DevToArticle, DevToConfig } from "../types"

interface RecentArticlesProps {
  articles: DevToArticle[]
  config: DevToConfig
  style?: "default" | "terminal"
  size?: "half" | "full"
}

/** Mantido em sincronia com calculateHeight em index.tsx. */
export const ARTICLE_ROW_HEIGHT = 44
export const ARTICLE_ROW_GAP = 8

export function RecentArticles({
  articles,
  config,
  style = "default",
  size = "half",
}: RecentArticlesProps): React.ReactElement {
  // Conta sem artigos publicados é comum, e o perfil sozinho já é um card válido.
  // Devolver <></> aqui é o que mantém calculateHeight em zero para a mesma
  // entrada -- a invariante coberta por calculate-height.test.ts.
  if (!articles || articles.length === 0) return <></>

  const hideTitle = config.recent_articles_hide_title === true || config.recent_articles_hide_title === "true"
  const title = config.recent_articles_title || "Recent Articles"
  const shown = articles.slice(0, config.recent_articles_max ?? 5)

  return (
    <section id="devto-recent-articles">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaRegNewspaper />} />}
            <div className="flex flex-col" style={{ gap: `${ARTICLE_ROW_GAP}px` }}>
              {shown.map((article) => (
                <div key={article.id} className="flex flex-col min-w-0 w-full">
                  <p className="text-sm truncate text-default-highlight">{article.title}</p>
                  <div className="flex gap-3 text-xs text-default-muted">
                    <span className="flex items-center gap-1">
                      <FaHeart />
                      {abbreviateNumber(article.reactions)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment />
                      {abbreviateNumber(article.comments)}
                    </span>
                    {article.readablePublishDate && <span className="truncate">{article.readablePublishDate}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "devto", section: "recent_articles", size })} />
            {shown.map((article) => (
              <TerminalLineWithDots
                key={article.id}
                title={article.title}
                value={`${abbreviateNumber(article.reactions)} ♥`}
              />
            ))}
          </>
        }
      />
    </section>
  )
}
