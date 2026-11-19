/**
 * WakaTime Plugin Metadata
 *
 * This file defines all sections, configurations and options for the WakaTime plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

const RANGE_OPTIONS = [
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_6_months", label: "Last 6 months" },
  { value: "last_year", label: "Last year" },
  { value: "all_time", label: "All time" },
]

const RANGE_TOOLTIP =
  "The period these numbers cover. Sections with the same period share one request to WakaTime. Long periods (last year, all time) can take WakaTime a while to compute: the card then shows the last numbers it had."

function titleOptions(section: string, title: string) {
  return [
    {
      key: `${section}_hide_title`,
      label: "Hide title",
      type: "boolean" as const,
      defaultValue: false,
    },
    {
      key: `${section}_title`,
      label: "Title",
      type: "string" as const,
      defaultValue: title,
    },
  ]
}

function rangeOption(section: string) {
  return {
    key: `${section}_range`,
    label: "Period",
    type: "select" as const,
    defaultValue: "last_7_days",
    options: RANGE_OPTIONS,
    tooltip: RANGE_TOOLTIP,
  }
}

function maxOption(section: string, label: string, defaultValue: number) {
  return {
    key: `${section}_max`,
    label: `Maximum ${label}`,
    type: "number" as const,
    defaultValue,
    min: 1,
    max: 15,
    step: 1,
    description: "Maximum 15",
  }
}

export const wakatimePluginMetadata = {
  displayName: "WakaTime",
  description: "Show the time you spent coding, by language, project, editor and operating system, from WakaTime",
  category: "coding" as const,
  icon: "Timer",
  requiredFields: [],
  essentialConfigKeys: ["token"],
  essentialConfigKeysMetadata: [
    {
      key: "token",
      label: "WakaTime Personal Token",
      type: "password" as const,
      placeholder: "waka_tok_...",
      description:
        'Your personal OAuth token, not the secret API key: WakaTime made API keys write-only. Open wakatime.com/oauth while signed in and copy the token under "Your secret OAuth token".',
      helpUrl: "https://wakatime.com/oauth",
      tooltip:
        "The API key only sends activity from your editor. Reading your stats takes the personal token from wakatime.com/oauth. It is stored encrypted and only read when your card is generated.",
      docKey: "wakatime.token",
    },
  ],
  sections: [
    {
      id: "time",
      name: "Coding Time",
      description: "Total coding time, daily average and best day",
      configOptions: [...titleOptions("time", "Coding Time"), rangeOption("time")],
    },
    {
      id: "languages",
      name: "Languages",
      description: "Time spent in each language",
      configOptions: [
        ...titleOptions("languages", "Languages"),
        rangeOption("languages"),
        maxOption("languages", "languages", 8),
        {
          key: "languages_ignore",
          label: "Ignored languages",
          type: "string" as const,
          defaultValue: "",
          placeholder: "Markdown, JSON, Other",
          description: "Comma-separated list of languages to hide",
          tooltip: "The percentages are taken over the languages that remain.",
        },
      ],
    },
    {
      id: "projects",
      name: "Projects",
      description: "Time spent in each project",
      configOptions: [
        ...titleOptions("projects", "Projects"),
        rangeOption("projects"),
        maxOption("projects", "projects", 5),
        {
          key: "projects_ignore",
          label: "Hidden projects",
          type: "string" as const,
          defaultValue: "",
          placeholder: "client-work, secret-project",
          description: "Comma-separated list of projects to hide",
          tooltip:
            "Every project WakaTime tracked shows up, private ones included. List the ones whose name should stay out of your README.",
        },
      ],
    },
    {
      id: "editors",
      name: "Editors",
      description: "Time spent in each editor",
      configOptions: [
        ...titleOptions("editors", "Editors"),
        rangeOption("editors"),
        maxOption("editors", "editors", 5),
      ],
    },
    {
      id: "operating_systems",
      name: "Operating Systems",
      description: "Time spent in each operating system",
      configOptions: [
        ...titleOptions("operating_systems", "Operating Systems"),
        rangeOption("operating_systems"),
        maxOption("operating_systems", "operating systems", 5),
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    sections: ["time", "languages", "editors"],
  },
}
