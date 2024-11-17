import React from "react"
import { FaCode } from "react-icons/fa"
import { TbLicense } from "react-icons/tb"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalTree from "source/templates/Terminal/TerminalTree"
import DefaultTitle from "templates/Default/DefaultTitle"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalLineBreak from "templates/Terminal/TerminalLineBreak"
import { GridItemProps } from "templates/types"
import ENV_VARIABLES from "../ENV_VARIABLES"
import { RepositoriesData } from "../types/RepositoryData"
import getPseudoCommands from "core/utils/getPseudoCommands"

interface FavoriteLicenseProps {
  data: RepositoriesData
}

const DefaultFavoriteLicense = ({ data }: FavoriteLicenseProps) => {
  const { favoriteLicense, repositories } = data
  const total = repositories.length

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center h-full">
        <TbLicense size={45} />
      </div>
      <div className="flex flex-col w-full">
        <span className="text-semibold text-default-muted text-lg">{favoriteLicense.name}</span>
        <span className="text-sm">
          Used in {favoriteLicense.count} out of {total} repositories
        </span>
      </div>
    </div>
  )
}

const TerminalFavoriteLicense = ({ data }: FavoriteLicenseProps) => {
  const { favoriteLicense } = data
  const total = data.repositories.length
  const percentage = ((favoriteLicense.count / total) * 100).toFixed(2)
  const TreeItems = [
    {
      title: favoriteLicense.name,
      subtitle: `${percentage}% of ${total} repositories`,
      value: `Used ${favoriteLicense.count} times`,
    },
  ] as GridItemProps[]

  return <TerminalTree data={TreeItems} title="Favorite License" />
}

const FavoriteLicense = ({ data }: FavoriteLicenseProps) => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const github = env.github
  if (!github) throw new Error("GitHub plugin not found")

  const title = github.favorite_license_title ?? (ENV_VARIABLES.favorite_license_title.defaultValue as string)
  const hideTitle = github.favorite_license_hide_title ?? false

  return (
    <section id="github-favorite-license">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLicense data={data} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                prefix: "gh",
                plugin: "github",
                section: "license",
                username: github.username,
                command: "list",
              })}
            />
            <TerminalFavoriteLicense data={data} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default FavoriteLicense
