import React from "react"
import { SiMyanimelist } from "react-icons/si"
import { Header } from "templates/Default/Default_Header"
import ErrorMessage from "templates/Error_Style"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalBody from "templates/Terminal/Terminal_Body"
import CheckPluginForRequiredValues from "../@utils/checkPluginForRequiredValues"
import AnimeFavorites from "./components/AnimeFavorites"
import CharactersFavorites from "./components/CharactersFavorites"
import StatisticsHorizontalBar from "./components/HorizontalBar"
import LastUpdates from "./components/LastUpdates"
import MangaFavorites from "./components/MangaFavorites"
import PeopleFavorites from "./components/PeopleFavorites"
import SimpleFavorites from "./components/SimpleFavorites"
import SimpleStatistics from "./components/SimpleStatistics"
import Statistics from "./components/Statistics"
import MAL_ENV_VARIABLES from "./ENV_VARIABLES"
import { MalData } from "./types/malTypes"
import MyAnimeListConfig, { MyAnimeListSections } from "./types/MyAnimeListConfig"
import logger from "source/helpers/logger"

const sectionRenderers: Record<string, (malData: MalData) => JSX.Element> = {
  statistics: (malData: MalData) => <Statistics data={malData.statistics} />,
  last_activity: (malData: MalData) => <LastUpdates data={malData.last_updated} />,
  statistics_simple: (malData: MalData) => <SimpleStatistics data={malData.statistics} />,

  // stats_circle: (malData: MalData) => <section>not yet made stats_circle</section>,
  anime_bar: (malData: MalData) => <StatisticsHorizontalBar data={malData.statistics.anime} />,
  manga_bar: (malData: MalData) => <StatisticsHorizontalBar data={malData.statistics.manga} />,

  anime_simple_favorites: (malData: MalData) => <SimpleFavorites data={malData.favorites.anime} type="anime" />,
  manga_simple_favorites: (malData: MalData) => <SimpleFavorites data={malData.favorites.manga} type="manga" />,
  people_simple_favorites: (malData: MalData) => <SimpleFavorites data={malData.favorites.people} type="people" />,
  character_simple_favorites: (malData: MalData) => (
    <SimpleFavorites data={malData.favorites.characters} type="characters" />
  ),

  anime_favorites: (malData: MalData) => <AnimeFavorites data={malData.favorites_full.anime} />,
  manga_favorites: (malData: MalData) => <MangaFavorites data={malData.favorites_full.manga} />,
  people_favorites: (malData: MalData) => <PeopleFavorites data={malData.favorites.people} />,
  character_favorites: (malData: MalData) => <CharactersFavorites data={malData.favorites.characters} />,
}

function RenderMyAnimeList({ plugin, data }: { plugin: MyAnimeListConfig; data: MalData }): React.ReactNode {
  logger({ message: `Rendering MAL sections`, level: "info", __filename })
  if (!data) return <ErrorMessage message="MyAnimeList data not found in RenderMyAnimeList" />
  const error = CheckPluginForRequiredValues({
    plugin,
    ENV_VARIABLES: MAL_ENV_VARIABLES,
    pluginName: "MyAnimeList",
  })
  if (error) return error

  const sections = plugin.sections
  const hideHeader = plugin.hide_header

  const renderSection = (section: string): JSX.Element => {
    if (sectionRenderers[section]) {
      return sectionRenderers[section](data)
    }
    logger({
      message: `Section "${section}" not found, available sections: \n${MyAnimeListSections.join("\n")}`,
      level: "error",
      __filename,
    })
    return <ErrorMessage message={`Section ${section} not found`} />
  }
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
            {!hideHeader && <Header icon={<SiMyanimelist />} title={"MyAnimeList"} />}
            {sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </>
        }
      />
    </>
  )
}

export default RenderMyAnimeList
