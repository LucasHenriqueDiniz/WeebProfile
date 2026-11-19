/**
 * LeetCode Plugin Metadata
 *
 * This file defines all sections, configurations and options for the LeetCode plugin.
 * It's used to automatically generate the centralized metadata.ts.
 *
 * DO NOT edit metadata.ts manually - it's automatically generated from this file.
 */

export const leetcodePluginMetadata = {
  displayName: "LeetCode",
  description: "Show your LeetCode problems solved, skills, languages and recent submissions",
  category: "coding" as const,
  icon: "Code",
  requiredFields: ["username"],
  essentialConfigKeys: [],
  essentialConfigKeysMetadata: [],
  sections: [
    {
      id: "solved",
      name: "Problems Solved",
      description: "Problems solved by difficulty, against how many LeetCode has",
      configOptions: [
        {
          key: "solved_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "solved_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "LeetCode Problems Solved",
        },
      ],
    },
    {
      id: "skills",
      name: "Skills",
      description: "Problems solved per topic tag, most solved first",
      configOptions: [
        {
          key: "skills_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "skills_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "LeetCode Skills",
        },
        {
          key: "skills_max",
          label: "Maximum skills",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 30,
          step: 1,
          description: "Maximum 30 skills",
        },
        {
          key: "skills_ignored",
          label: "Ignored skills",
          type: "string" as const,
          defaultValue: "",
          description: "Comma-separated tags to hide (e.g. 'Array, String')",
          tooltip:
            "Tags are matched without case. 'fundamental', 'intermediate' or 'advanced' hides every tag of that LeetCode level.",
        },
      ],
    },
    {
      id: "languages",
      name: "Languages",
      description: "Problems solved per programming language",
      configOptions: [
        {
          key: "languages_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "languages_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "LeetCode Languages",
        },
        {
          key: "languages_max",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
        },
      ],
    },
    {
      id: "recent",
      name: "Recent Submissions",
      description: "Your latest accepted submissions",
      configOptions: [
        {
          key: "recent_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Accepted Submissions",
        },
        {
          key: "recent_max",
          label: "Maximum submissions",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 submissions (LeetCode lists only the last 20)",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "example",
    sections: ["solved", "skills"],
  },
}
