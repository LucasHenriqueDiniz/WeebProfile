/**
 * Metadata do Plugin Codeforces
 */

export const codeforcesPluginMetadata = {
  displayName: "Codeforces",
  description: "Show your Codeforces competitive programming statistics",
  category: "coding" as const,
  icon: "Code",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "rating_rank",
      name: "Rating & Rank",
      description: "Display your current rating and rank",
      configOptions: [
        {
          key: "rating_rank_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "rating_rank_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Rating & Rank",
        },
      ],
    },
    {
      id: "contests_participated",
      name: "Contests Participated",
      description: "Display number of contests participated",
      configOptions: [
        {
          key: "contests_participated_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "contests_participated_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Contests Participated",
        },
      ],
    },
    {
      id: "problems_solved",
      name: "Problems Solved",
      description: "Display problems solved by difficulty",
      configOptions: [
        {
          key: "problems_solved_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "problems_solved_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Problems Solved",
        },
      ],
    },
    {
      id: "recent_submissions",
      name: "Recent Submissions",
      description: "Display recent submissions",
      configOptions: [
        {
          key: "recent_submissions_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_submissions_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Submissions",
        },
        {
          key: "recent_submissions_max",
          label: "Maximum submissions",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 submissions",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["rating_rank", "contests_participated", "problems_solved", "recent_submissions"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["rating_rank"],
    username: "",
  },
  fieldDefaults: {
    username: "example",
  },
}


