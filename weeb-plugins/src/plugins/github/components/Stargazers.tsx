import React from "react"
import { FaStar } from "react-icons/fa"
import { RiStarFill } from "react-icons/ri"
import { DefaultTitle } from "../../../templates/Default/DefaultTitle"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import { TerminalCommand } from "../../../templates/Terminal/TerminalCommand"
import { TerminalGrid } from "../../../templates/Terminal/TerminalGrid"
import { abbreviateNumber } from "../../../utils/number"
import { getPseudoCommands } from "../../../utils/pseudo-commands"
import type { GithubConfig, GithubData } from "../types"

const DefaultStargazers = ({ data }: { data: NonNullable<GithubData["stargazers"]> }) => {
  const maxRepos = 10
  const reposToShow = data.repositories.slice(0, maxRepos)

  return (
    <div className="github-stargazers">
      <div className="mb-4 p-4 rounded-lg bg-default-muted/10 border border-default-border">
        <div className="flex items-center gap-2">
          <RiStarFill className="text-yellow-500 text-2xl" />
          <div>
            <div className="text-2xl font-bold text-default-text">{abbreviateNumber(data.totalCount)}</div>
            <div className="text-sm text-default-muted">Total stars received</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {reposToShow.map((repo, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-default-border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className="p-2 rounded-md bg-default-muted/10">
                  <FaStar className="text-yellow-500" size={18} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base text-default-text truncate">{repo.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-default-muted flex-shrink-0">
              <FaStar className="text-yellow-500 fill-yellow-500" size={14} />
              <span className="text-sm font-medium">{abbreviateNumber(repo.stargazerCount)}</span>
            </div>
          </div>
        ))}
      </div>
      {data.repositories.length > maxRepos && (
        <div className="mt-4 text-center text-sm text-default-muted">
          +{data.repositories.length - maxRepos} more repositories
        </div>
      )}
    </div>
  )
}

const TerminalStargazers = ({ data }: { data: NonNullable<GithubData["stargazers"]> }) => {
  const maxRepos = 10
  const reposToShow = data.repositories.slice(0, maxRepos)

  const gridData = [
    {
      title: "Total Stars",
      value: abbreviateNumber(data.totalCount),
    },
    ...reposToShow.map((repo) => ({
      title: repo.name,
      value: `⭐ ${abbreviateNumber(repo.stargazerCount)}`,
    })),
  ]

  return (
    <>
      <TerminalGrid data={gridData} rightText="Repository" leftText="Stars" />
      {data.repositories.length > maxRepos && (
        <div className="text-terminal-muted text-sm text-center mt-2">+{data.repositories.length - maxRepos} more</div>
      )}
    </>
  )
}

interface StargazersProps {
  data: GithubData["stargazers"]
  config: GithubConfig
  style: "default" | "terminal"
  size: "half" | "full"
}

export function GithubStargazers({ data, config, style, size }: StargazersProps): React.ReactElement {
  if (!data || data.totalCount === 0) {
    return <></>
  }

  const title = (config.stargazers_title ?? "<qnt> Stars Received").replace("<qnt>", abbreviateNumber(data.totalCount))
  const hideTitle = config.stargazers_hide_title ?? false

  return (
    <section id="github-stargazers">
      <RenderBasedOnStyle
        style={style}
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiStarFill />} />}
            <DefaultStargazers data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "stargazers",
                size,
              })}
            />
            <TerminalStargazers data={data} />
          </>
        }
      />
    </section>
  )
}
