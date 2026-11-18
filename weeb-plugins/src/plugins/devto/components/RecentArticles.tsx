import React from "react"
import { FaComment, FaHeart, FaRegNewspaper } from "react-icons/fa"
import { CascadeGroup, useItemCascade, withCascade } from "../../../templates/animations"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalLineWithDots } from "../../../templates/Terminal/TerminalLineWithDots"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { DevToArticle, DevToConfig } from "../types"
import { ExternalLink } from "../../../utils/external-link"

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
  const shown = (articles ?? []).slice(0, config.recent_articles_max ?? 5)
  const cascade = useItemCascade(shown.length)

  // Conta sem artigos publicados é comum, e o perfil sozinho já é um card válido.
  // Devolver <></> aqui é o que mantém calculateHeight em zero para a mesma
  // entrada -- a invariante coberta por calculate-height.test.ts.
  if (!articles || articles.length === 0) return <></>

  const hideTitle = config.recent_articles_hide_title === true || config.recent_articles_hide_title === "true"
  const title = config.recent_articles_title || "Recent Articles"

  return (
    <section id="devto-recent-articles">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <div className="w-full overflow-hidden flex flex-col gap-3 half:gap-2.5">
            {!hideTitle && <DefaultTitle title={title} icon={<FaRegNewspaper />} />}
            <div
              className={withCascade("flex flex-col", cascade)}
              style={{ gap: `${ARTICLE_ROW_GAP}px`, ...cascade?.style }}
            >
              {shown.map((article) => (
                <ExternalLink key={article.id} href={article.url} className="flex flex-col min-w-0 w-full">
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
                </ExternalLink>
              ))}
            </div>
          </div>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "devto", section: "recent_articles", size })} />
            <CascadeGroup count={shown.length}>
              {shown.map((article) => (
                <TerminalLineWithDots
                  key={article.id}
                  href={article.url}
                  title={article.title}
                  value={`${abbreviateNumber(article.reactions)} ♥`}
                />
              ))}
            </CascadeGroup>
          </>
        }
      />
    </section>
  )
}
