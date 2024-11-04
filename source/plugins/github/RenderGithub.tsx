import React from "react"
import { FaGithub } from "react-icons/fa"
import { Header } from "templates/Default/Default_Header"
import ErrorMessage from "templates/Error_Style"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalBody from "templates/Terminal/Terminal_Body"
import CheckPluginForRequiredValues from "../@utils/checkPluginForRequiredValues"
import FavoriteLanguages from "./components/FavoriteLanguages"
import FavoriteLicense from "./components/FavoriteLicenses"
import GithubProfile from "./components/Profile"
import GithubRepositories from "./components/Repositories"
import GITHUB_ENV_VARIABLES from "./ENV_VARIABLES"
import { githubResponse } from "./types"
import GithubConfig, { GithubSections } from "./types/GithubConfig"

interface Props {
  plugin: GithubConfig
  data: githubResponse
}

export default function RenderGithub({ plugin, data }: Props): JSX.Element {
  if (!data) return <ErrorMessage message="Data not found" />
  const error = CheckPluginForRequiredValues({
    plugin,
    ENV_VARIABLES: GITHUB_ENV_VARIABLES,
    pluginName: "Github",
  })
  if (error) return error

  const sections = plugin.sections

  interface SectionRenderers {
    [key: string]: (githubData: githubResponse) => JSX.Element
  }

  const sectionRenderers: SectionRenderers = {
    profile: (githubData) => {
      if (githubData.userData === null) {
        return <ErrorMessage message={`User "${plugin.username}" not found`} />
      }
      return <GithubProfile userData={githubData.userData} />
    },
    repositories: (githubData) => {
      if (githubData.repositoriesData === null) {
        return <ErrorMessage message={`User "${plugin.username}" not found`} />
      }
      return <GithubRepositories repositoriesData={githubData.repositoriesData} />
    },
    favorite_languages: (githubData) => {
      if (githubData.repositoriesData === null) {
        return <ErrorMessage message={`User "${plugin.username}" not found`} />
      }
      return <FavoriteLanguages repositoriesData={githubData.repositoriesData} />
    },
    favorite_license: (githubData) => {
      if (githubData.repositoriesData === null) {
        return <ErrorMessage message={`User "${plugin.username}" not found`} />
      }
      return <FavoriteLicense repositoriesData={githubData.repositoriesData} />
    },
  }

  const renderSection = (section: string): JSX.Element => {
    if (sectionRenderers[section]) {
      return sectionRenderers[section](data)
    }
    return <ErrorMessage message={`Section "${section}" not found, available sections: \n${GithubSections}`} />
  }

  const hideHeader = plugin.hide_header

  return (
    <>
      <RenderBasedOnStyle
        terminalComponent={
          <TerminalBody>
            {sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </TerminalBody>
        }
        defaultComponent={
          <>
            {!hideHeader && <Header title={"GitHub"} icon={<FaGithub />} />}
            {sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </>
        }
      />
    </>
  )
}
