import { faker } from "@faker-js/faker";
import { LastFmTrack, TopTrack, LastFmArtist, LastFmAlbum, LastFmData, LastFmFeaturedTrack } from "../types/lastFmTypes";

function lastFmTestGenerateRecentTracksData(): LastFmTrack[] {
  const recentTracks = Array.from({ length: 20 }, () => ({
    track: faker.music.songName(),
    artist: faker.music.artist(),
    date: faker.number.int({ min: 0, max: 60 }) + " minutes ago",
    image: faker.image.urlLoremFlickr({ width: 300, height: 300, category: "song" }),
  }));
  return recentTracks.sort((a, b) => {
    return parseInt(a.date.replace(" minutes ago", "")) - parseInt(b.date.replace(" minutes ago", ""));
  });
}

function lastFmTestGenerateTopArtistsData(): LastFmArtist[] {
  const topArtists = Array.from({ length: 20 }, () => ({
    artist: faker.music.artist(),
    image: faker.image.urlLoremFlickr({ width: 300, height: 300, category: "singer" }),
    totalPlays: faker.number.int({ min: 0, max: 1000000 }).toString(),
  }));
  return topArtists;
}

function lastFmTestGenerateTopAlbumsData(): LastFmAlbum[] {
  const topAlbums = Array.from({ length: 20 }, () => ({
    album: faker.music.album(),
    artist: faker.music.artist(),
    plays: faker.number.int({ min: 0, max: 1000000 }).toString(),
    image: faker.image.urlLoremFlickr({ width: 300, height: 300, category: "cover" }),
  }));
  return topAlbums;
}

function lastFmTestGenerateTopTracksData(): TopTrack[] {
  const topTracks = Array.from({ length: 20 }, () => ({
    track: faker.music.songName(),
    artist: faker.music.artist(),
    plays: faker.number.int({ min: 0, max: 1000000 }).toString(),
    image: faker.image.urlLoremFlickr({ width: 300, height: 300, category: "song" }),
  }));
  return topTracks;
}

function lastFmTestGenerateFeaturedTrackData(): LastFmFeaturedTrack {
  return {
    track: faker.music.songName(),
    artist: faker.music.artist(),
    image: faker.image.urlLoremFlickr({ width: 300, height: 300, category: "song" }),
  };
}

function lastFmTestGenerateData(): LastFmData {
  return {
    totalScrobbles: faker.number.int({ min: 0, max: 1000000 }).toString(),
    totalArtists: faker.number.int({ min: 0, max: 1000000 }).toString(),
    lovedTracks: faker.music.songName(),
    recentTracks: lastFmTestGenerateRecentTracksData(),
    topArtists: lastFmTestGenerateTopArtistsData(),
    topAlbums: lastFmTestGenerateTopAlbumsData(),
    topTracks: lastFmTestGenerateTopTracksData(),
    featuredTrack: lastFmTestGenerateFeaturedTrackData(),
    topAlbumsInterval: "Last 365 days",
    topArtistsInterval: "Last 365 days",
    topTracksInterval: "Last 365 days",
  };
}

export {
  lastFmTestGenerateData,
  lastFmTestGenerateRecentTracksData,
  lastFmTestGenerateTopArtistsData,
  lastFmTestGenerateTopAlbumsData,
  lastFmTestGenerateTopTracksData,
  lastFmTestGenerateFeaturedTrackData,
};
