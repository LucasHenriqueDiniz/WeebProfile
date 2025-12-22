/**
 * Spotify Plugin Metadata
 * 
 * This file defines all sections, configurations and options for the Spotify plugin.
 * It's used to automatically generate the centralized metadata.ts.
 * 
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const spotifyPluginMetadata = {
  displayName: "Spotify",
  description: "Show your Spotify music statistics",
  category: "music" as const,
  icon: "Music",
  requiredFields: [],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "recent_tracks",
      name: "Recent Tracks",
      description: "Recently played tracks",
      configOptions: [
        {
          key: "recent_tracks_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_tracks_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Tracks",
        },
        {
          key: "recent_tracks_max",
          label: "Maximum tracks",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 tracks",
        },
      ],
    },
    {
      id: "top_artists",
      name: "Top Artists",
      description: "Most listened artists",
      configOptions: [
        {
          key: "top_artists_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "top_artists_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Artists",
        },
        {
          key: "top_artists_max",
          label: "Maximum artists",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 artists",
        },
        {
          key: "top_artists_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "default",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default" },
          ],
        },
        {
          key: "top_artists_period",
          label: "Period",
          type: "select" as const,
          defaultValue: "medium_term",
          options: [
            { value: "short_term", label: "Last 4 weeks" },
            { value: "medium_term", label: "Last 6 months" },
            { value: "long_term", label: "All time" },
          ],
        },
      ],
    },
    {
      id: "top_tracks",
      name: "Top Tracks",
      description: "Most listened tracks",
      configOptions: [
        {
          key: "top_tracks_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "top_tracks_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Tracks",
        },
        {
          key: "top_tracks_max",
          label: "Maximum tracks",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 tracks",
        },
        {
          key: "top_tracks_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "default",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default" },
          ],
        },
        {
          key: "top_tracks_period",
          label: "Period",
          type: "select" as const,
          defaultValue: "medium_term",
          options: [
            { value: "short_term", label: "Last 4 weeks" },
            { value: "medium_term", label: "Last 6 months" },
            { value: "long_term", label: "All time" },
          ],
        },
      ],
    },
    {
      id: "currently_playing",
      name: "Currently Playing",
      description: "Track currently playing",
      configOptions: [
        {
          key: "currently_playing_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "currently_playing_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Now Playing",
        },
      ],
    },
    {
      id: "playlists",
      name: "Playlists",
      description: "User playlists",
      configOptions: [
        {
          key: "playlists_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "playlists_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Playlists",
        },
        {
          key: "playlists_max",
          label: "Maximum playlists",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 playlists",
        },
      ],
    },
    {
      id: "profile",
      name: "Profile",
      description: "User profile information",
      configOptions: [
        {
          key: "profile_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Profile",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["recent_tracks", "top_artists"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["recent_tracks"],
  },
}
