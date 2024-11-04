"use client"
import Axios from "axios"
import { CacheOptions, setupCache } from "axios-cache-interceptor"
import Bottleneck from "bottleneck"
import * as cheerio from "cheerio"
import getImage64 from "plugins/@utils/imageToBase64"
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES"
import { lastFmTestGenerateData } from "../test/generateTestData"
import LastFmPlugin from "../types/envLastFM"
import { LastFmAlbum, LastFmArtist, LastFmData, LastFmFeaturedTrack, LastFmTrack, TopTrack } from "../types/lastFmTypes"
import logger from "source/helpers/logger"

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 3000,
  reservoir: 15,
  reservoirRefreshAmount: 15,
  reservoirRefreshInterval: 30 * 1000,
})

const axiosInstance = Axios.create()
const OPTIONS = {
  maxAge: 1 * 60 * 60 * 1000, // 1
  //don't cache != 200 responses
  shouldCacheResponse: (response: { status: number }) => response.status === 200,
  clearOnStale: true,
  cacheTakeover: false,
} as CacheOptions
const axios = setupCache(axiosInstance, OPTIONS)

async function fetchLastFmData(plugin: LastFmPlugin, dev = false): Promise<LastFmData> {
  if (dev) {
    return lastFmTestGenerateData()
  }

  logger({
    message: `Fetching LastFM data for ${plugin.username}`,
    level: "info",
    __filename,
  })
  const response = await limiter.schedule(() => axios.get(`https://www.last.fm/user/${plugin.username}`))

  logger({
    message: `Data fetched`,
    level: "info",
    __filename,
  })

  const $ = cheerio.load(response.data)

  let recentTracksArray: LastFmTrack[] = []
  let topArtistsArray: LastFmArtist[] = []
  let topAlbumsArray: LastFmAlbum[] = []
  let topTracksArray: TopTrack[] = []
  let treatedFeaturedTrack: LastFmFeaturedTrack | null = null

  let topArtistsInterval
  let topAlbumsInterval
  let topTracksInterval

  let totalScrobbles = "0"
  let totalArtists = "0"
  let lovedTracks = "0"

  const sections = plugin.sections
  const recent_tracks_max = plugin.recent_tracks_max ?? (LASTFM_ENV_VARIABLES.recent_tracks_max.defaultValue as number)
  const top_artists_max = plugin.top_artists_max ?? (LASTFM_ENV_VARIABLES.top_artists_max.defaultValue as number)
  const top_albums_max = plugin.top_albums_max ?? (LASTFM_ENV_VARIABLES.top_albums_max.defaultValue as number)
  const top_tracks_max = plugin.top_tracks_max ?? (LASTFM_ENV_VARIABLES.top_tracks_max.defaultValue as number)

  const hasRecentTracks = sections.includes("recent_tracks")
  const hasTopArtists =
    sections.includes("top_artists_list") ||
    sections.includes("top_artists_grid") ||
    sections.includes("top_artists_default")
  const hasTopAlbums =
    sections.includes("top_albums_list") ||
    sections.includes("top_albums_grid") ||
    sections.includes("top_albums_default")
  const hasTopTracks =
    sections.includes("top_tracks_list") ||
    sections.includes("top_tracks_grid") ||
    sections.includes("top_tracks_default")
  const hasStatistics = sections.includes("statistics")

  if (hasRecentTracks) {
    logger({
      message: `Parsing recent tracks`,
      level: "debug",
      __filename,
    })
    try {
      const recentTracks = $("#recent-tracks-section .chartlist-row")
      recentTracksArray = recentTracks
        .map((i, el) => {
          if (i >= recent_tracks_max) return
          const track = $(el).find(".chartlist-name").text().trim()
          const artist = $(el).find(".chartlist-artist").text().trim()
          const date = $(el).find(".chartlist-timestamp").text().trim()
          const image = $(el).find(".chartlist-image img").attr("src")
          return { track, artist, date, image }
        })
        .get()
    } catch (error) {
      logger({
        message: `Error parsing recent tracks ${error}`,
        level: "error",
        __filename,
      })
    }
    logger({
      message: `Recent tracks parsed ${recentTracksArray.length}`,
      level: "debug",
      __filename,
    })
  }

  if (hasTopArtists) {
    logger({
      message: `Parsing top artists`,
      level: "debug",
      __filename,
    })
    try {
      let topArtists = $("#top-artists .chartlist-row")
      topArtistsInterval = $("#top-artists .section-control").text().replace("Sorted by:", "").trim()

      if (topArtists.length === 0) {
        topArtists = $("#top-artists .grid-items-item")
        topArtistsArray = topArtists
          .map((i, el) => {
            if (i >= top_artists_max) return
            const artist = $(el).find(".grid-items-item-main-text").text().trim()
            const totalPlays = $(el).find(".grid-items-item-aux-text").text().replace("scrobbles", "").trim()
            const image = $(el).find(".grid-items-cover-image-image img").attr("src")
            return { artist, image, totalPlays }
          })
          .get()
      } else {
        topArtistsArray = topArtists
          .map((i, el) => {
            if (i >= top_artists_max) return
            const artist = $(el).find(".chartlist-name").text().trim()
            const totalPlays = $(el).find(".chartlist-count-bar-value").text().replace("scrobbles", "").trim()
            const image = $(el).find(".chartlist-image img").attr("src")
            return { artist, image, totalPlays }
          })
          .get()
      }
    } catch (error) {
      logger({
        message: `Error parsing top artists ${error}`,
        level: "error",
        __filename,
      })
    }
    logger({
      message: `Top artists parsed ${topArtistsArray.length}`,
      level: "debug",
      __filename,
    })
  }

  if (hasTopAlbums) {
    logger({
      message: `Parsing top albums`,
      level: "debug",
      __filename,
    })
    try {
      let topAlbums = $("#top-albums .chartlist-row")
      topAlbumsInterval = $("#top-albums .section-control").text().replace("Sorted by:", "").trim()

      if (topAlbums.length === 0) {
        topAlbums = $("#top-albums .grid-items-item")
        topAlbumsArray = topAlbums
          .map((i, el) => {
            if (i >= top_albums_max) return
            const album = $(el).find(".grid-items-item-main-text").text().trim()
            const artist = $(el).find(".grid-items-item-aux-block").text().trim()
            const plays = $(el).find(".grid-items-item-aux-text a").last().text().replace("scrobbles", "").trim()
            const image = $(el).find(".grid-items-cover-image-image img").attr("src")
            return { album, artist, plays, image }
          })
          .get()
      } else {
        topAlbumsArray = topAlbums
          .map((i, el) => {
            if (i >= top_albums_max) return
            const album = $(el).find(".chartlist-name").text().trim()
            const artist = $(el).find(".chartlist-artist").text().trim()
            const plays = $(el).find(".chartlist-count-bar-value").text().replace("scrobbles", "").trim()
            const image = $(el).find(".chartlist-image img").attr("src")
            return { album, artist, plays, image }
          })
          .get()
      }
    } catch (error) {
      logger({
        message: `Error parsing top albums ${error}`,
        level: "error",
        __filename,
      })
    }
    logger({
      message: `Top albums parsed ${topAlbumsArray.length}`,
      level: "debug",
      __filename,
    })
  }

  if (hasTopTracks) {
    logger({
      message: `Parsing top tracks`,
      level: "debug",
      __filename,
    })
    try {
      let topTracks = $("#top-tracks .chartlist-row")
      topTracksInterval = $("#top-tracks .section-control").text().replace("Sorted by:", "").trim()

      if (topTracks.length === 0) {
        topTracks = $("#top-tracks .grid-items-item")
        topTracksArray = topTracks
          .map((i, el) => {
            if (i >= top_tracks_max) return
            const track = $(el).find(".grid-items-item-main-text").text().trim()
            const artist = $(el).find(".grid-items-item-aux-block").text().trim()
            const plays = $(el).find(".grid-items-item-aux-text a").last().text().replace("scrobbles", "").trim()
            const image = $(el).find(".grid-items-cover-image-image img").attr("src")
            return { track, artist, plays, image }
          })
          .get()
      } else {
        topTracksArray = topTracks
          .map((i, el) => {
            if (i >= top_tracks_max) return
            const track = $(el).find(".chartlist-name").text().trim()
            const artist = $(el).find(".chartlist-artist").text().trim()
            const plays = $(el).find(".chartlist-count-bar-value").text().replace("scrobbles", "").trim()
            const image = $(el).find(".chartlist-image img").attr("src")
            return { track, artist, plays, image }
          })
          .get()
      }
    } catch (error) {
      logger({
        message: `Error parsing top tracks ${error}`,
        level: "error",
        __filename,
      })
    }
    logger({
      message: `Top tracks parsed ${topTracksArray.length}`,
      level: "debug",
      __filename,
    })
  }

  if (hasStatistics) {
    logger({
      message: `Parsing metadata`,
      level: "debug",
      __filename,
    })
    try {
      totalScrobbles = $('.header-metadata-item a[href$="/library"]').text().trim()
      totalArtists = $('.header-metadata-item a[href$="/artists"]').text().trim()
      lovedTracks = $('.header-metadata-item a[href$="/loved"]').text().trim()
      logger({
        message: `Loved tracks ${lovedTracks} Total scrobbles ${totalScrobbles} Total artists ${totalArtists}`,
        level: "debug",
        __filename,
      })
    } catch (error) {
      logger({
        message: `Error parsing metadata ${error}`,
        level: "error",
        __filename,
      })
    }
    try {
      const featuredTrack = $(".header-featured-track")
      treatedFeaturedTrack = {
        track: featuredTrack.find(".header-featured-track .featured-item-name").text().trim(),
        artist: featuredTrack.find(".header-featured-track .featured-item-artist").text().trim(),
        image: featuredTrack.find(".featured-item-art img").attr("src"),
      }
    } catch (error) {
      logger({
        message: `Error parsing featured track ${error}`,
        level: "error",
        __filename,
      })
    }
    logger({
      message: `Featured track parsed ${treatedFeaturedTrack?.track}`,
      level: "debug",
      __filename,
    })
  }

  // get image 64 | TODO: refactor to use Promise.all
  for (const track of recentTracksArray) {
    const img = track.image?.replace("64s", "300s") ?? ""
    track.image = await getImage64(img)
  }
  for (const artist of topArtistsArray) {
    const img = artist.image?.replace("64s", "300s") ?? ""
    artist.image = await getImage64(img)
  }
  for (const album of topAlbumsArray) {
    const img = album.image?.replace("64s", "300s") ?? ""
    album.image = await getImage64(img)
  }
  for (const track of topTracksArray) {
    const img = track.image?.replace("64s", "300s") ?? ""
    track.image = await getImage64(img)
  }
  if (treatedFeaturedTrack) {
    treatedFeaturedTrack.image = await getImage64(treatedFeaturedTrack.image)
  }
  logger({
    message: `LastFM data parsed`,
    level: "info",
    __filename,
  })

  const LastFmData: LastFmData = {
    totalScrobbles,
    totalArtists,
    lovedTracks,
    recentTracks: recentTracksArray,
    topArtists: topArtistsArray,
    topAlbums: topAlbumsArray,
    topTracks: topTracksArray,
    featuredTrack: treatedFeaturedTrack,
    topArtistsInterval: topArtistsInterval ?? "Unknow",
    topAlbumsInterval: topAlbumsInterval ?? "Unknown",
    topTracksInterval: topTracksInterval ?? "Unknown",
  }

  return LastFmData
}

export default fetchLastFmData
