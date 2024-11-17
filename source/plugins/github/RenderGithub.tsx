import React from "react"
import ErrorMessage from "templates/Error_Style"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalBody from "templates/Terminal/TerminalBody"
import CheckPluginForRequiredValues from "../@utils/checkPluginForRequiredValues"
import FavoriteLanguages from "./components/FavoriteLanguages"
import FavoriteLicense from "./components/FavoriteLicense"
import GithubProfile from "./components/Profile"
import GithubRepositories from "./components/Repositories"
import GITHUB_ENV_VARIABLES, { GithubSections } from "./ENV_VARIABLES"
import GithubConfig from "./types/GithubConfig"
import GithubData from "./types/GithubData"
import GithubActivity from "./components/Activity"
import GithubCodeHabits from "./components/CodeHabits"
import GithubCalendar from "./components/Calendar"

interface Props {
  plugin: GithubConfig
  data: GithubData
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
    [key: string]: (githubData: GithubData) => JSX.Element
  }

  const sectionRenderers: SectionRenderers = {
    profile: (githubData) => {
      return <GithubProfile key="profile" data={githubData.user} />
    },
    repositories: (githubData) => {
      return <GithubRepositories key="repositories" data={githubData.repositories} />
    },
    favorite_languages: (githubData) => {
      return (
        <FavoriteLanguages
          key="favorite_languages"
          languageData={githubData.languages}
          repositoriesData={githubData.repositories}
        />
      )
    },
    favorite_license: (githubData) => {
      return <FavoriteLicense key="favorite_license" data={githubData.favoriteLicense} />
    },
    activity: (githubData) => {
      return <GithubActivity key="activity" data={githubData.activity} />
    },
    calendar: (githubData) => {
      return <GithubCalendar key="calendar" data={githubData.calendar} />
    },
    code_habits: (githubData) => {
      return <GithubCodeHabits key="code_habits" data={githubData.codeHabits} />
    },
  }

  const renderSection = (section: string): JSX.Element => {
    if (sectionRenderers[section]) {
      return sectionRenderers[section](data)
    }
    return <ErrorMessage message={`Section "${section}" not found, available sections: \n${GithubSections}`} />
  }

  return (
    <>
      <RenderBasedOnStyle
        terminalComponent={<TerminalBody>{sections.map((section) => renderSection(section))}</TerminalBody>}
        defaultComponent={<>{sections.map((section) => renderSection(section))}</>}
      />
    </>
  )
}
