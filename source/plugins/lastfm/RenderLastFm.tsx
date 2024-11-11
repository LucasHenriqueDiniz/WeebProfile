import React from "react"
import { FaLastfm } from "react-icons/fa"
import Header from "templates/Default/Default_Header"
import ErrorMessage from "templates/Error_Style"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalBody from "templates/Terminal/TerminalBody"
import {
  RecentTracks,
  Statistics,
  TopAlbumsDefault,
  TopAlbumsGrid,
  TopAlbumsList,
  TopArtistsDefault,
  TopArtistsGrid,
  TopArtistsList,
  TopTracksDefault,
  TopTracksGrid,
  TopTracksList,
} from "./components"
import LastFmPlugin, { LastFmSections } from "./types/envLastFM"
import { LastFmData } from "./types/lastFmTypes"
import LASTFM_ENV_VARIABLES from "./ENV_VARIABLES"
import CheckPluginForRequiredValues from "plugins/@utils/checkPluginForRequiredValues"

interface Props {
  plugin: LastFmPlugin
  data: LastFmData
}

interface SectionRenderers {
  [key: string]: (lastFmData: LastFmData) => JSX.Element
}

const sectionRenderers: SectionRenderers = {
  recent_tracks: (lastFmData) => <RecentTracks data={lastFmData.recentTracks} />,
  statistics: (lastFmData) => <Statistics data={lastFmData} />,

  top_artists_grid: (lastFmData) => (
    <TopArtistsGrid data={lastFmData.topArtists} interval={lastFmData.topArtistsInterval} />
  ),
  top_artists_list: (lastFmData) => (
    <TopArtistsList data={lastFmData.topArtists} interval={lastFmData.topAlbumsInterval} />
  ),
  top_artists_default: (lastFmData) => (
    <TopArtistsDefault data={lastFmData.topArtists} interval={lastFmData.topAlbumsInterval} />
  ),

  top_albums_list: (lastFmData) => (
    <TopAlbumsList data={lastFmData.topAlbums} interval={lastFmData.topAlbumsInterval} />
  ),
  top_albums_grid: (lastFmData) => (
    <TopAlbumsGrid data={lastFmData.topAlbums} interval={lastFmData.topAlbumsInterval} />
  ),
  top_albums_default: (lastFmData) => (
    <TopAlbumsDefault data={lastFmData.topAlbums} interval={lastFmData.topAlbumsInterval} />
  ),

  top_tracks_list: (lastFmData) => (
    <TopTracksList data={lastFmData.topTracks} interval={lastFmData.topTracksInterval} />
  ),
  top_tracks_grid: (lastFmData) => (
    <TopTracksGrid data={lastFmData.topTracks} interval={lastFmData.topTracksInterval} />
  ),
  top_tracks_default: (lastFmData) => (
    <TopTracksDefault data={lastFmData.topTracks} interval={lastFmData.topTracksInterval} />
  ),
}

export default function RenderLastFm({ plugin, data }: Props): JSX.Element {
  // check if has any required value missing
  const error = CheckPluginForRequiredValues({
    plugin,
    ENV_VARIABLES: LASTFM_ENV_VARIABLES,
    pluginName: "LastFM",
  })
  if (error) return error

  if (!data) return <ErrorMessage message="LastFM Data not found in render component" />

  const sections = plugin.sections

  const renderSection = (section: string): JSX.Element => {
    if (sectionRenderers[section]) {
      return sectionRenderers[section](data)
    }
    return (
      <ErrorMessage message={`Section "${section}" not found. Available sections: \n${LastFmSections.join(", ")}`} />
    )
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
            {!hideHeader && <Header title="LastFM" icon={<FaLastfm />} />}
            {sections.map((section) => (
              <div key={section}>{renderSection(section)}</div>
            ))}
          </>
        }
      />
    </>
  )
}
