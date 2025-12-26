/**
 * Metadata do Plugin LastFM
 * 
 * This file defines all sections, configurations and options for the LastFM plugin.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 * 
 * DO NOT edit metadata.ts manually - it is generated automatically from this file.
 */

export const lastfmPluginMetadata = {
  displayName: "LastFM",
  description: "Show your LastFM music statistics",
  category: "music" as const,
  icon: "Music",
  requiredFields: ["username"],
  essentialConfigKeys: ["apiKey", "username"],
  essentialConfigKeysMetadata: [
    {
      key: "apiKey",
      label: "LastFM API Key",
      type: "password" as const,
      placeholder: "your-api-key",
      description: "API Key from LastFM",
      helpUrl: "https://www.last.fm/api/account/create",
      docKey: "lastfm.apiKey",
    },
    {
      key: "username",
      label: "LastFM Username",
      type: "text" as const,
      placeholder: "your-username",
      description: "Your LastFM username",
      helpUrl: "https://www.last.fm/",
      docKey: "lastfm.username",
    },
  ],
  sections: [
    {
      id: "recent_tracks",
      name: "Recent Tracks",
      description: "Recent tracks listened",
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
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 músicas",
          tooltip: "Número máximo de músicas recentes que serão exibidas. Mostra as últimas músicas que você escutou no LastFM.",
        },
      ],
    },
    {
      id: "statistics",
      name: "Statistics",
      description: "General statistics from LastFM",
      configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Statistics",
        },
        {
          key: "statistics_hide_featured_track",
          label: "Hide featured track",
          type: "boolean" as const,
          defaultValue: false,
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
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 artistas",
          tooltip: "Número máximo de artistas que serão exibidos. Valores maiores podem aumentar o tempo de carregamento.",
        },
        {
          key: "top_artists_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "grid",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" },
          ],
          tooltip: "Grid: exibe os artistas em formato de grade com imagens de perfil.\nList: exibe os artistas em formato de lista compacta.",
        },
        {
          key: "top_artists_period",
          label: "Period",
          type: "select" as const,
          defaultValue: "overall",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" },
          ],
          tooltip: "Período de tempo para calcular os artistas mais ouvidos. 'All time' mostra seus artistas mais ouvidos de todos os tempos.",
        },
      ],
    },
    {
      id: "top_albums",
      name: "Top Albums",
      description: "Most listened albums",
      configOptions: [
        {
          key: "top_albums_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "top_albums_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Albums",
        },
        {
          key: "top_albums_max",
          label: "Maximum albums",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 álbuns",
          tooltip: "Número máximo de álbuns que serão exibidos. Valores maiores podem aumentar o tempo de carregamento.",
        },
        {
          key: "top_albums_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "grid",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" },
          ],
          tooltip: "Grid: exibe os álbuns em formato de grade com capas de álbum.\nList: exibe os álbuns em formato de lista compacta.",
        },
        {
          key: "top_albums_period",
          label: "Period",
          type: "select" as const,
          defaultValue: "overall",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" },
          ],
          tooltip: "Período de tempo para calcular os álbuns mais ouvidos. 'All time' mostra seus álbuns mais ouvidos de todos os tempos.",
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
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tracks",
          tooltip: "Número máximo de faixas que serão exibidas. Valores maiores podem aumentar o tempo de carregamento.",
        },
        {
          key: "top_tracks_style",
          label: "Display style",
          type: "select" as const,
          defaultValue: "grid",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" },
          ],
          tooltip: "Grid: exibe as faixas em formato de grade com capas de álbum.\nList: exibe as faixas em formato de lista compacta.",
        },
        {
          key: "top_tracks_period",
          label: "Period",
          type: "select" as const,
          defaultValue: "overall",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" },
          ],
          tooltip: "Período de tempo para calcular as faixas mais ouvidas. 'All time' mostra suas faixas mais ouvidas de todos os tempos.",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "exemplo",
    sections: ["recent_tracks", "top_artists"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["recent_tracks"],
    username: "",
  },
  fieldDefaults: {
    username: "exemplo",
  },
}

