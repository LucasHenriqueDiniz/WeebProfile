import { FaCode } from "react-icons/fa"
import { TbLicense } from "react-icons/tb"
import DefaultTitle from "templates/Default/Default_Title"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalCommand from "source/templates/Terminal/TerminalCommand"
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak"
import TerminalTree from "templates/Terminal/Terminal_Tree"
import { GridItemProps } from "templates/types"
import getPseudoCommands from "core/utils/getPseudoCommands"
import React from "react"
import getEnvVariables from "source/plugins/@utils/getEnvVariables"
import { RepositoriesData } from "../types/RepositoriesData"
import ENV_VARIABLES from "../ENV_VARIABLES"

const DefaultFavoriteLicense = ({ repositoriesData }: { repositoriesData: RepositoriesData }) => {
  const { favoriteLicense, repositories } = repositoriesData
  const total = repositories.length

  return (
    <div className="flex gap-8 items-center">
      <TbLicense size={32} />
      <div className="flex-d gap-2">
        <span className="md-text text-bold">{favoriteLicense.name}</span>
        <span className="sm-text">
          Used in {favoriteLicense.count} out of {total} repositories
        </span>
      </div>
    </div>
  )
}

const TerminalFavoriteLicense = ({ repositoriesData }: { repositoriesData: RepositoriesData }) => {
  const { favoriteLicense } = repositoriesData
  const total = repositoriesData.repositories.length
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

const FavoriteLicense = ({ repositoriesData }: { repositoriesData: RepositoriesData }) => {
  const { github } = getEnvVariables()
  if (!github) throw new Error("GitHub plugin not found")

  const title = github.favorite_license_title ?? (ENV_VARIABLES.favorite_license_title.defaultValue as string)
  const hideTitle = github.favorite_license_hide_title ?? false

  return (
    <section id="github" className="favorite-license">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<FaCode />} />}
            <DefaultFavoriteLicense repositoriesData={repositoriesData} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "favorite-license",
              })}
            />
            <TerminalFavoriteLicense repositoriesData={repositoriesData} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  )
}

export default FavoriteLicense
