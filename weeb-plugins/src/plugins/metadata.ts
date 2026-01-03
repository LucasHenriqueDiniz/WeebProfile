/**
 * Centralized metadata for all plugins
 * 
 * This file serves as a single index of all available plugins,
 * their sections, configurations and options. When a new plugin is added,
 * it must be registered here to appear automatically everywhere.
 * 
 * ⚠️  THIS FILE IS AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 * 
 * To update this file:
 * 1. Edit the plugin.metadata.ts file in each plugin directory
 * 2. Run: pnpm tsx scripts/generate-metadata.ts
 */

/**
 * Plugin category
 */
export type PluginCategory = "coding" | "music" | "anime" | "gaming"

/**
 * Metadata for an essential configuration key (API key, token, etc)
 */
export interface EssentialConfigKeyMetadata {
  key: string
  label: string
  type: "text" | "password" | "oauth"
  placeholder?: string
  description?: string
  helpUrl?: string // Direct link to create/get token (e.g., https://github.com/settings/personal-access-tokens/new)
  docKey?: string // Key for future documentation (e.g., "github.pat")
  oauthProvider?: "spotify" // OAuth provider when type === "oauth"
}

/**
 * Configuration option for a section
 */
export interface SectionConfigOption {
  key: string
  label: string
  type: "number" | "boolean" | "string" | "select" | "array"
  defaultValue?: any
  min?: number
  max?: number
  step?: number
  description?: string
  placeholder?: string
  required?: boolean
  tooltip?: string
  options?: { value: string; label: string }[]
}

/**
 * Available section of a plugin
 */
export interface PluginSection {
  id: string
  name: string
  description?: string
  configOptions?: SectionConfigOption[]
}

/**
 * Complete metadata of a plugin
 */
export interface PluginMetadata {
  name: string
  displayName: string
  description: string
  category: PluginCategory
  icon: string // Name of lucide-react icon (e.g., "Github", "Music", "BookOpen")
  requiredFields: string[]
  essentialConfigKeys: string[] // Kept for compatibility, but use essentialConfigKeysMetadata
  essentialConfigKeysMetadata: EssentialConfigKeyMetadata[] // Complete metadata of essential keys
  sections: PluginSection[]
  globalConfigOptions?: SectionConfigOption[] // Global configuration options (apply to all sections)
  exampleConfig?: Record<string, any>
}

/**
 * Metadata de todos os plugins disponíveis
 * 
 * Usa `satisfies` para garantir type safety completo sem perder inferência de tipos
 * 
 * ⚠️  AUTO-GENERATED - DO NOT EDIT MANUALLY ⚠️
 */
export const PLUGINS_METADATA = {
  ["16personalities"]: {
    name: "16personalities",
    displayName: "16Personalities",
    description: "Display your 16Personalities type with emoji and link",
    category: "coding",
    icon: "UserCircle",
    requiredFields: ["personality_url"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "personality",
        name: "Personality",
        description: "Display your 16Personalities personality type",
        configOptions: [
        {
          key: "personality_url",
          label: "16Personalities Result URL",
          type: "string",
          defaultValue: "",
          description: "Paste your 16Personalities test result URL to automatically detect your type",
          placeholder: "https://www.16personalities.com/br/resultados/enfj-t/m/...",
          required: true,
          tooltip: "Paste the full URL from your 16Personalities test results page. The plugin will automatically extract your personality type from the URL."
        },
        {
          key: "personality_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "personality_title",
          label: "Title",
          type: "string",
          defaultValue: "Personality"
        },
        {
          key: "personality_show_description",
          label: "Show description",
          type: "boolean",
          defaultValue: true,
          description: "Show a short description of the personality type"
        },
        {
          key: "personality_show_link",
          label: "Show link",
          type: "boolean",
          defaultValue: true,
          description: "Show link to the personality type page on 16Personalities"
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "sections": [
        "personality"
      ],
      "personality_url": "https://www.16personalities.com/br/resultados/enfj-t/m/example"
    },
  },

  codeforces: {
    name: "codeforces",
    displayName: "Codeforces",
    description: "Show your Codeforces competitive programming statistics",
    category: "coding",
    icon: "Code",
    requiredFields: ["username"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "rating_rank",
        name: "Rating & Rank",
        description: "Display your current rating and rank",
        configOptions: [
        {
          key: "rating_rank_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "rating_rank_title",
          label: "Title",
          type: "string",
          defaultValue: "Rating & Rank"
        }
        ]
      },
      {
        id: "contests_participated",
        name: "Contests Participated",
        description: "Display the number of contests you've participated in",
        configOptions: [
        {
          key: "contests_participated_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "contests_participated_title",
          label: "Title",
          type: "string",
          defaultValue: "Contests Participated"
        }
        ]
      },
      {
        id: "problems_solved",
        name: "Problems Solved",
        description: "Display the number of problems solved by difficulty",
        configOptions: [
        {
          key: "problems_solved_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "problems_solved_title",
          label: "Title",
          type: "string",
          defaultValue: "Problems Solved"
        }
        ]
      },
      {
        id: "recent_submissions",
        name: "Recent Submissions",
        description: "Display your recent problem submissions",
        configOptions: [
        {
          key: "recent_submissions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "recent_submissions_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Submissions"
        },
        {
          key: "recent_submissions_max",
          label: "Maximum submissions",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 submissions",
          tooltip: "Maximum number of recent submissions to display. Submissions are ordered by most recent."
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "example",
      "sections": [
        "rating_rank",
        "contests_participated",
        "problems_solved"
      ]
    },
  },

  codewars: {
    name: "codewars",
    displayName: "Codewars",
    description: "Show your Codewars kata solving statistics",
    category: "coding",
    icon: "Swords",
    requiredFields: ["username"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "rank_honor",
        name: "Rank & Honor",
        description: "Display your current rank and honor points",
        configOptions: [
        {
          key: "rank_honor_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "rank_honor_title",
          label: "Title",
          type: "string",
          defaultValue: "Rank & Honor"
        }
        ]
      },
      {
        id: "completed_kata",
        name: "Completed Kata",
        description: "Display your recently completed kata",
        configOptions: [
        {
          key: "completed_kata_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "completed_kata_title",
          label: "Title",
          type: "string",
          defaultValue: "Completed Kata"
        },
        {
          key: "completed_kata_max",
          label: "Maximum kata",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 kata",
          tooltip: "Maximum number of completed kata to display. Kata are ordered by most recently completed."
        }
        ]
      },
      {
        id: "languages_proficiency",
        name: "Languages Proficiency",
        description: "Display your proficiency in different programming languages",
        configOptions: [
        {
          key: "languages_proficiency_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "languages_proficiency_title",
          label: "Title",
          type: "string",
          defaultValue: "Languages Proficiency"
        },
        {
          key: "languages_proficiency_max",
          label: "Maximum languages",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
          tooltip: "Maximum number of languages to display. Languages are ordered by score (highest score first)."
        }
        ]
      },
      {
        id: "leaderboard_position",
        name: "Leaderboard Position",
        description: "Display your position on the global leaderboard",
        configOptions: [
        {
          key: "leaderboard_position_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "leaderboard_position_title",
          label: "Title",
          type: "string",
          defaultValue: "Leaderboard Position"
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "example",
      "sections": [
        "rank_honor",
        "completed_kata",
        "languages_proficiency"
      ]
    },
  },

  duolingo: {
    name: "duolingo",
    displayName: "Duolingo",
    description: "Show your Duolingo learning statistics",
    category: "coding",
    icon: "BookOpen",
    requiredFields: ["username"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "current_streak",
        name: "Duolingo Streak",
        description: "Display your current streak in days",
        configOptions: [
        {
          key: "current_streak_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: true
        },
        {
          key: "current_streak_title",
          label: "Title",
          type: "string",
          defaultValue: "Current Streak"
        }
        ]
      },
      {
        id: "total_xp",
        name: "Total XP",
        description: "Display your total XP accumulated",
        configOptions: [
        {
          key: "total_xp_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "total_xp_title",
          label: "Title",
          type: "string",
          defaultValue: "Total XP"
        }
        ]
      },
      {
        id: "languages_learning",
        name: "Languages Learning",
        description: "Display languages you're learning with XP per language",
        configOptions: [
        {
          key: "languages_learning_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "languages_learning_title",
          label: "Title",
          type: "string",
          defaultValue: "Languages Learning"
        },
        {
          key: "languages_learning_max",
          label: "Maximum languages",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
          tooltip: "Maximum number of languages that will be displayed. Languages are ordered by total XP (highest XP first)."
        },
        {
          key: "languages_learning_hide_languages",
          label: "Hide languages",
          type: "array",
          defaultValue: [],
          description: "List of language names to hide (e.g., Japanese, French)",
          tooltip: "List of language names you want to hide from display. Type the exact language name (e.g., 'Japanese', 'French', 'Spanish') and press Enter to add."
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "example",
      "sections": [
        "current_streak",
        "total_xp",
        "languages_learning"
      ]
    },
  },

  github: {
    name: "github",
    displayName: "GitHub",
    description: "Show your GitHub statistics",
    category: "coding",
    icon: "Github",
    requiredFields: ["username"],
    essentialConfigKeys: ["pat"],
    essentialConfigKeysMetadata: [
        {
          key: "pat",
          label: "GitHub Classic Token",
          type: "password",
          placeholder: "ghp_...",
          description: "Classic token is used to fetch data from GitHub API",
          helpUrl: "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
          docKey: "github.pat"
        }
    ],
    sections: [
      {
        id: "profile",
        name: "Profile",
        description: "User profile with avatar and basic statistics",
        configOptions: [
        {
          key: "profile_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string",
          defaultValue: "Profile"
        },
        {
          key: "profile_hide_avatar",
          label: "Hide avatar",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "activity",
        name: "Activity",
        description: "Activity statistics (commits, PRs, issues)",
        configOptions: [
        {
          key: "activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Activity"
        }
        ]
      },
      {
        id: "repositories",
        name: "Repositories",
        description: "List of repositories",
        configOptions: [
        {
          key: "repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Repositories"
        },
        {
          key: "repositories_use_private",
          label: "Include private repositories",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "repositories_max",
          label: "Maximum repositories",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 repositories",
          tooltip: "Maximum number of repositories to display. Repositories are ordered by stars (most starred first)."
        }
        ]
      },
      {
        id: "favorite_languages",
        name: "Favorite Languages",
        description: "Most used programming languages",
        configOptions: [
        {
          key: "favorite_languages_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "favorite_languages_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Languages"
        },
        {
          key: "favorite_languages_max_languages",
          label: "Maximum languages",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
          tooltip: "Maximum number of programming languages to display. Languages are ordered by total bytes of code (most used first)."
        },
        {
          key: "favorite_languages_ignore_languages",
          label: "Ignorar linguagens",
          type: "string",
          defaultValue: "",
          description: "Lista de linguagens separadas por vírgula para ignorar"
        }
        ]
      },
      {
        id: "favorite_license",
        name: "Favorite License",
        description: "Most used license in repositories",
        configOptions: [
        {
          key: "favorite_license_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "favorite_license_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite License"
        }
        ]
      },
      {
        id: "calendar",
        name: "Calendar",
        description: "Contribution calendar",
        configOptions: [
        {
          key: "calendar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "calendar_title",
          label: "Title",
          type: "string",
          defaultValue: "Calendar"
        },
        {
          key: "calendar_years",
          label: "Years",
          type: "string",
          defaultValue: "",
          description: "Comma-separated list of years (e.g., '2023,2024'). Leave empty for current year",
          tooltip: "Specify which years to display in the contribution calendar. If empty, only the current year is shown."
        }
        ]
      },
      {
        id: "code_habits",
        name: "Code Habits",
        description: "Code habits (hours, days of the week)",
        configOptions: [
        {
          key: "code_habits_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "code_habits_title",
          label: "Title",
          type: "string",
          defaultValue: "Code Habits"
        },
        {
          key: "code_habits_hide_languages",
          label: "Hide languages",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "code_habits_hide_stats",
          label: "Hide statistics",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "code_habits_hide_weekdays",
          label: "Hide weekdays",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "code_habits_hide_hours",
          label: "Hide hours",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "code_habits_hide_footer",
          label: "Hide footer",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "starred_repositories",
        name: "Starred Repositories",
        description: "Starred repositories",
        configOptions: [
        {
          key: "starred_repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "starred_repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Starred Repositories"
        },
        {
          key: "starred_repositories_max",
          label: "Maximum repositories",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 repositories",
          tooltip: "Maximum number of starred repositories to display. Repositories are ordered by most recently starred."
        }
        ]
      },
      {
        id: "gists",
        name: "Gists",
        description: "User's public gists",
        configOptions: [
        {
          key: "gists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "gists_title",
          label: "Title",
          type: "string",
          defaultValue: "Gists"
        },
        {
          key: "gists_max",
          label: "Maximum gists",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 gists",
          tooltip: "Maximum number of gists to display. Gists are ordered by most recently created."
        }
        ]
      },
      {
        id: "stargazers",
        name: "Stargazers",
        description: "Total stars received on repositories",
        configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string",
          defaultValue: "Stargazers"
        }
        ]
      },
      {
        id: "top_repositories",
        name: "Top Repositories",
        description: "Repositories with most stars (alias for stargazers)",
        configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Repositories"
        }
        ]
      },
      {
        id: "star_lists",
        name: "Star Lists",
        description: "Organized lists of starred repositories",
        configOptions: [
        {
          key: "star_lists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "star_lists_title",
          label: "Title",
          type: "string",
          defaultValue: "Star Lists"
        },
        {
          key: "star_lists_max",
          label: "Maximum lists",
          type: "number",
          defaultValue: 1,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 lists",
          tooltip: "Maximum number of star lists to display. Lists are ordered by most recently created."
        }
        ]
      },
      {
        id: "notable_contributions",
        name: "Notable Contributions",
        description: "Notable contributions to repositories",
        configOptions: [
        {
          key: "notable_contributions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "notable_contributions_title",
          label: "Title",
          type: "string",
          defaultValue: "Notable Contributions"
        },
        {
          key: "notable_contributions_max",
          label: "Maximum contributions",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 contributions",
          tooltip: "Maximum number of notable contributions to display. Contributions are ordered by most recent."
        }
        ]
      },
      {
        id: "recent_activity",
        name: "Recent Activity",
        description: "User's recent activity",
        configOptions: [
        {
          key: "recent_activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "recent_activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Activity"
        },
        {
          key: "recent_activity_max",
          label: "Maximum activities",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 activities",
          tooltip: "Maximum number of recent activities to display. Activities are ordered by most recent."
        }
        ]
      },
      {
        id: "introduction",
        name: "Introduction",
        description: "User profile introduction",
        configOptions: [
        {
          key: "introduction_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "introduction_title",
          label: "Title",
          type: "string",
          defaultValue: "Introduction"
        },
        {
          key: "introduction_custom_text",
          label: "Custom text",
          type: "string",
          defaultValue: "",
          description: "Custom text to display before the bio",
          tooltip: "Optional custom text that will be displayed before the user's bio. Leave empty to only show the bio."
        }
        ]
      },
      {
        id: "featured_repositories",
        name: "Featured Repositories",
        description: "Featured repositories (requires repository URL)",
        configOptions: [
        {
          key: "featured_repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "featured_repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Featured Repositories"
        },
        {
          key: "featured_repositories_urls",
          label: "Repository URLs",
          type: "string",
          defaultValue: "",
          description: "Comma-separated repository URLs (e.g., 'owner/repo1,owner/repo2'). Maximum 20 repositories.",
          tooltip: "Enter repository URLs in the format 'owner/repo'. Separate multiple repositories with commas. Maximum 20 repositories can be featured."
        }
        ]
      },
      {
        id: "sponsorships",
        name: "GitHub Sponsorships",
        description: "Sponsorships do GitHub",
        configOptions: [
        {
          key: "sponsorships_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "sponsorships_title",
          label: "Title",
          type: "string",
          defaultValue: "Sponsorships"
        },
        {
          key: "sponsorships_max",
          label: "Maximum sponsorships",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 sponsorships",
          tooltip: "Maximum number of sponsorships to display. Sponsorships are ordered by most recent."
        }
        ]
      },
      {
        id: "sponsors",
        name: "GitHub Sponsors",
        description: "Sponsors do GitHub",
        configOptions: [
        {
          key: "sponsors_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "sponsors_title",
          label: "Title",
          type: "string",
          defaultValue: "Sponsors"
        },
        {
          key: "sponsors_max",
          label: "Maximum sponsors",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 sponsors",
          tooltip: "Maximum number of sponsors to display. Sponsors are ordered by most recent."
        }
        ]
      },
      {
        id: "people",
        name: "People",
        description: "Related people (followers, contributors, etc)",
        configOptions: [
        {
          key: "people_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "people_title",
          label: "Title",
          type: "string",
          defaultValue: "People"
        },
        {
          key: "people_type",
          label: "Type",
          type: "select",
          defaultValue: "profile",
          tooltip: "Select 'Profile' to show user followers, or 'Repository' to show repository-specific people (requires repository field).",
          options: [
            { value: "profile", label: "Profile (followers)" },
            { value: "repository", label: "Repository (contributors, stargazers, watchers, sponsors)" }
          ]
        },
        {
          key: "people_repository",
          label: "Repository (only for repository type)",
          type: "string",
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Required when type is 'repository'. Enter the repository in the format 'owner/repo'."
        },
        {
          key: "people_max",
          label: "Maximum people",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 people",
          tooltip: "Maximum number of people to display. People are ordered by most recent interaction."
        }
        ]
      },
      {
        id: "repository_contributors",
        name: "Repository Contributors",
        description: "Contributors to a repository",
        configOptions: [
        {
          key: "repository_contributors_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "repository_contributors_title",
          label: "Title",
          type: "string",
          defaultValue: "Contributors"
        },
        {
          key: "repository_contributors_repository",
          label: "Repository",
          type: "string",
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Enter the repository in the format 'owner/repo'. This field is required."
        },
        {
          key: "repository_contributors_max",
          label: "Maximum contributors",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 contributors",
          tooltip: "Maximum number of contributors to display. Contributors are ordered by total contributions (most contributions first)."
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "octocat",
      "sections": [
        "profile",
        "activity"
      ]
    },
  },

  lastfm: {
    name: "lastfm",
    displayName: "LastFM",
    description: "Show your LastFM music statistics",
    category: "music",
    icon: "Music",
    requiredFields: ["username"],
    essentialConfigKeys: ["apiKey","username"],
    essentialConfigKeysMetadata: [
        {
          key: "apiKey",
          label: "LastFM API Key",
          type: "password",
          placeholder: "your-api-key",
          description: "API Key from LastFM",
          helpUrl: "https://www.last.fm/api/account/create",
          docKey: "lastfm.apiKey"
        },
        {
          key: "username",
          label: "LastFM Username",
          type: "text",
          placeholder: "your-username",
          description: "Your LastFM username",
          helpUrl: "https://www.last.fm/",
          docKey: "lastfm.username"
        }
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
          type: "boolean",
          defaultValue: false
        },
        {
          key: "recent_tracks_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Tracks"
        },
        {
          key: "recent_tracks_max",
          label: "Maximum tracks",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tracks",
          tooltip: "Maximum number of recent tracks to display. Tracks are ordered by most recently played."
        }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        description: "General statistics from LastFM",
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics"
        },
        {
          key: "statistics_hide_featured_track",
          label: "Hide featured track",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "top_artists",
        name: "Top Artists",
        description: "Most listened artists",
        configOptions: [
        {
          key: "top_artists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "top_artists_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Artists"
        },
        {
          key: "top_artists_max",
          label: "Maximum artists",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 artists",
          tooltip: "Maximum number of top artists to display. Artists are ordered by total play count (most played first)."
        },
        {
          key: "top_artists_style",
          label: "Display style",
          type: "select",
          defaultValue: "grid",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" }
          ]
        },
        {
          key: "top_artists_period",
          label: "Period",
          type: "select",
          defaultValue: "overall",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" }
          ]
        }
        ]
      },
      {
        id: "top_albums",
        name: "Top Albums",
        description: "Most listened albums",
        configOptions: [
        {
          key: "top_albums_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "top_albums_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Albums"
        },
        {
          key: "top_albums_max",
          label: "Maximum albums",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 albums",
          tooltip: "Maximum number of top albums to display. Albums are ordered by total play count (most played first)."
        },
        {
          key: "top_albums_style",
          label: "Display style",
          type: "select",
          defaultValue: "grid",
          tooltip: "Choose how to display the albums: Grid shows album covers in a grid layout, List shows a compact list format.",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" }
          ]
        },
        {
          key: "top_albums_period",
          label: "Period",
          type: "select",
          defaultValue: "overall",
          tooltip: "Select the time period for top albums. 'All time' shows your most played albums ever, while other options show recent activity.",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" }
          ]
        }
        ]
      },
      {
        id: "top_tracks",
        name: "Top Tracks",
        description: "Most listened tracks",
        configOptions: [
        {
          key: "top_tracks_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "top_tracks_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Tracks"
        },
        {
          key: "top_tracks_max",
          label: "Maximum tracks",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tracks"
        },
        {
          key: "top_tracks_style",
          label: "Display style",
          type: "select",
          defaultValue: "grid",
          tooltip: "Choose how to display the tracks: Grid shows track artwork in a grid layout, List shows a compact list format.",
          options: [
            { value: "grid", label: "Grid" },
            { value: "list", label: "List" },
            { value: "default", label: "Default (Grid)" }
          ]
        },
        {
          key: "top_tracks_period",
          label: "Period",
          type: "select",
          defaultValue: "overall",
          tooltip: "Select the time period for top tracks. 'All time' shows your most played tracks ever, while other options show recent activity.",
          options: [
            { value: "overall", label: "All time" },
            { value: "7day", label: "Last 7 days" },
            { value: "1month", label: "Last month" },
            { value: "3month", label: "Last 3 months" },
            { value: "6month", label: "Last 6 months" },
            { value: "12month", label: "Last year" }
          ]
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "exemplo",
      "sections": [
        "recent_tracks",
        "top_artists"
      ]
    },
  },

  lyfta: {
    name: "lyfta",
    displayName: "Lyfta",
    description: "Show your workout statistics from Lyfta",
    category: "gaming",
    icon: "Dumbbell",
    requiredFields: [],
    essentialConfigKeys: ["apiKey"],
    essentialConfigKeysMetadata: [
        {
          key: "apiKey",
          label: "Lyfta API Key",
          type: "password",
          placeholder: "your-api-key",
          description: "API Key from Lyfta (generate at https://my.lyfta.app/community/api)",
          helpUrl: "https://my.lyfta.app/community/api",
          docKey: "lyfta.apiKey"
        }
    ],
    sections: [
      {
        id: "statistics",
        name: "Statistics",
        description: "General workout statistics",
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics"
        },
        {
          key: "statistics_period_days",
          label: "Period (days)",
          type: "number",
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days for period stats"
        },
        {
          key: "weight_unit",
          label: "Weight unit",
          type: "select",
          defaultValue: "kg",
          description: "Unit to display weight values",
          options: [
            { value: "kg", label: "Kilograms (kg)" },
            { value: "lbs", label: "Pounds (lbs)" }
          ]
        }
        ]
      },
      {
        id: "recent_workouts",
        name: "Recent Workouts",
        description: "Recently performed workouts",
        configOptions: [
        {
          key: "recent_workouts_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "recent_workouts_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Workouts"
        },
        {
          key: "workouts_max",
          label: "Maximum workouts",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 workouts",
          tooltip: "Maximum number of recent workouts to display. Workouts are ordered by most recent."
        }
        ]
      },
      {
        id: "exercises",
        name: "Exercises",
        description: "Most performed exercises",
        configOptions: [
        {
          key: "exercises_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "exercises_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Exercises"
        },
        {
          key: "exercises_max",
          label: "Maximum exercises",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 exercises",
          tooltip: "Maximum number of exercises to display. Exercises are ordered by total volume (highest volume first)."
        },
        {
          key: "exercises_show_1rm",
          label: "Show estimated 1RM",
          type: "boolean",
          defaultValue: true,
          description: "Display estimated one-rep max for each exercise"
        },
        {
          key: "exercises_compact",
          label: "Compact mode",
          type: "boolean",
          defaultValue: false,
          description: "Hide avg/1RM, show only sessions count"
        },
        {
          key: "exercises_hide_images",
          label: "Hide exercise images",
          type: "boolean",
          defaultValue: false,
          description: "Hide exercise images in the exercises list"
        }
        ]
      },
      {
        id: "overview",
        name: "Overview",
        description: "General workout summary for a period",
        configOptions: [
        {
          key: "overview_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "overview_title",
          label: "Title",
          type: "string",
          defaultValue: "Overview"
        },
        {
          key: "overview_period_days",
          label: "Period (days)",
          type: "number",
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days to include in overview"
        },
        {
          key: "overview_show_volume",
          label: "Show total volume",
          type: "boolean",
          defaultValue: true
        },
        {
          key: "overview_show_duration",
          label: "Show total duration",
          type: "boolean",
          defaultValue: true
        },
        {
          key: "overview_show_weekly_avg",
          label: "Show weekly average",
          type: "boolean",
          defaultValue: true
        }
        ]
      },
      {
        id: "last_workout",
        name: "Last Workout",
        description: "Detailed view of the most recent workout",
        configOptions: [
        {
          key: "last_workout_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "last_workout_title",
          label: "Title",
          type: "string",
          defaultValue: "Last Workout"
        },
        {
          key: "last_workout_show_body_weight",
          label: "Show body weight",
          type: "boolean",
          defaultValue: true
        },
        {
          key: "last_workout_max_exercises",
          label: "Maximum exercises",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 10,
          step: 1,
          description: "Maximum exercises to display"
        },
        {
          key: "last_workout_compact",
          label: "Compact mode",
          type: "boolean",
          defaultValue: false,
          description: "Hide set details, show only volume"
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "sections": [
        "overview",
        "last_workout",
        "exercises",
        "recent_workouts"
      ]
    },
  },

  myanimelist: {
    name: "myanimelist",
    displayName: "MyAnimeList",
    description: "Display your anime and manga statistics from MyAnimeList",
    category: "anime",
    icon: "BookOpen",
    requiredFields: ["username"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "statistics",
        name: "Statistics",
        description: "General anime and manga statistics",
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics"
        },
        {
          key: "statistics_media",
          label: "Media type",
          type: "select",
          defaultValue: "both",
          options: [
            { value: "both", label: "Both" },
            { value: "anime", label: "Anime only" },
            { value: "manga", label: "Manga only" }
          ]
        }
        ]
      },
      {
        id: "last_activity",
        name: "Last Activity",
        description: "Latest anime and manga updates",
        configOptions: [
        {
          key: "last_activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "last_activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Last Activity"
        },
        {
          key: "last_activity_max",
          label: "Max items",
          type: "number",
          defaultValue: 6,
          min: 1,
          max: 6,
          description: "Maximum number of activity items to display"
        },
        {
          key: "last_activity_hide_anime",
          label: "Hide anime",
          type: "boolean",
          defaultValue: false,
          description: "Hide anime updates from last activity"
        },
        {
          key: "last_activity_hide_manga",
          label: "Hide manga",
          type: "boolean",
          defaultValue: false,
          description: "Hide manga updates from last activity"
        }
        ]
      },
      {
        id: "statistics_simple",
        name: "Statistics Simple",
        description: "Simplified statistics",
        configOptions: [
        {
          key: "statistics_simple_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "statistics_simple_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics"
        }
        ]
      },
      {
        id: "anime_bar",
        name: "Anime Bar",
        description: "Horizontal bar chart for anime statistics",
        configOptions: [
        {
          key: "anime_bar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "anime_bar_title",
          label: "Title",
          type: "string",
          defaultValue: "Anime Statistics"
        }
        ]
      },
      {
        id: "manga_bar",
        name: "Manga Bar",
        description: "Horizontal bar chart for manga statistics",
        configOptions: [
        {
          key: "manga_bar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "manga_bar_title",
          label: "Title",
          type: "string",
          defaultValue: "Manga Statistics"
        }
        ]
      },
      {
        id: "anime_favorites",
        name: "Anime Favorites",
        description: "Anime favorites with different list styles",
        configOptions: [
        {
          key: "anime_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "anime_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Anime"
        },
        {
          key: "anime_favorites_list_style",
          label: "List style",
          type: "select",
          defaultValue: "detailed",
          description: "Choose the list display style",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
            { value: "detailed", label: "Detailed (Full list with summary)" },
            { value: "minimal", label: "Minimal (List without summary)" }
          ]
        },
        {
          key: "anime_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of anime favorites to display"
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "manga_favorites",
        name: "Manga Favorites",
        description: "Manga favorites with different list styles",
        configOptions: [
        {
          key: "manga_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "manga_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Manga"
        },
        {
          key: "manga_favorites_list_style",
          label: "List style",
          type: "select",
          defaultValue: "detailed",
          description: "Choose the list display style",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" },
            { value: "detailed", label: "Detailed (Full list with summary)" },
            { value: "minimal", label: "Minimal (List without summary)" }
          ]
        },
        {
          key: "manga_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of manga favorites to display"
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "character_favorites",
        name: "Character Favorites",
        description: "Character favorites with different list styles",
        configOptions: [
        {
          key: "character_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "character_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Characters"
        },
        {
          key: "character_favorites_list_style",
          label: "List style",
          type: "select",
          defaultValue: "simple",
          description: "Choose the list display style",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" }
          ]
        },
        {
          key: "character_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of character favorites to display"
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false
        }
        ]
      },
      {
        id: "people_favorites",
        name: "People Favorites",
        description: "People favorites (authors, directors, etc) with different list styles",
        configOptions: [
        {
          key: "people_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "people_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite People"
        },
        {
          key: "people_favorites_list_style",
          label: "List style",
          type: "select",
          defaultValue: "simple",
          description: "Choose the list display style",
          options: [
            { value: "simple", label: "Simple (Image grid)" },
            { value: "compact", label: "Compact (Compact list)" }
          ]
        },
        {
          key: "people_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of people favorites to display"
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false
        }
        ]
      }
    ],
    globalConfigOptions: [
        {
          key: "favorites_max",
          label: "Max favorites",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of favorites to display (applies to all favorite sections)"
        }
    ],
    exampleConfig: {
      "enabled": true,
      "username": "example",
      "sections": [
        "statistics",
        "last_activity"
      ]
    },
  },

  stackoverflow: {
    name: "stackoverflow",
    displayName: "Stack Overflow",
    description: "Show your Stack Overflow reputation and activity statistics",
    category: "coding",
    icon: "MessageSquareQuestion",
    requiredFields: ["userId"],
    essentialConfigKeys: [],
    essentialConfigKeysMetadata: [

    ],
    sections: [
      {
        id: "reputation",
        name: "Reputation",
        description: "Display your current reputation and reputation change",
        configOptions: [
        {
          key: "reputation_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "reputation_title",
          label: "Title",
          type: "string",
          defaultValue: "Reputation"
        }
        ]
      },
      {
        id: "badges",
        name: "Badges",
        description: "Display your badge counts (gold, silver, bronze)",
        configOptions: [
        {
          key: "badges_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "badges_title",
          label: "Title",
          type: "string",
          defaultValue: "Badges"
        }
        ]
      },
      {
        id: "answers_questions",
        name: "Answers & Questions",
        description: "Display your total answers and questions count",
        configOptions: [
        {
          key: "answers_questions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "answers_questions_title",
          label: "Title",
          type: "string",
          defaultValue: "Answers & Questions"
        },
        {
          key: "answers_questions_hide_questions",
          label: "Hide questions count",
          type: "boolean",
          defaultValue: false,
          description: "Only show answers count"
        }
        ]
      },
      {
        id: "tags_expertise",
        name: "Tags Expertise",
        description: "Display your top tags by score",
        configOptions: [
        {
          key: "tags_expertise_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "tags_expertise_title",
          label: "Title",
          type: "string",
          defaultValue: "Tags Expertise"
        },
        {
          key: "tags_expertise_max",
          label: "Maximum tags",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tags",
          tooltip: "Maximum number of tags to display. Tags are ordered by score (highest score first)."
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "userId": "123456",
      "sections": [
        "reputation",
        "badges",
        "answers_questions"
      ]
    },
  },

  steam: {
    name: "steam",
    displayName: "Steam",
    description: "Show your Steam gaming statistics",
    category: "gaming",
    icon: "Gamepad2",
    requiredFields: [],
    essentialConfigKeys: ["apiKey","steamId"],
    essentialConfigKeysMetadata: [
        {
          key: "apiKey",
          label: "Steam Web API Key",
          type: "password",
          placeholder: "your-api-key",
          description: "API Key from Steam Web API",
          helpUrl: "https://steamcommunity.com/dev/apikey",
          docKey: "steam.apiKey"
        },
        {
          key: "steamId",
          label: "Steam ID64",
          type: "text",
          placeholder: "76561198000000000",
          description: "Your Steam ID64 (17 digits)",
          helpUrl: "https://steamid.io/",
          docKey: "steam.steamId"
        }
    ],
    sections: [
      {
        id: "statistics",
        name: "Statistics",
        description: "General statistics from Steam",
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics"
        },
        {
          key: "statistics_show_featured",
          label: "Show featured game",
          type: "boolean",
          defaultValue: true,
          description: "Show the 'Destaque recente' card with the most played game in the last 2 weeks"
        }
        ]
      },
      {
        id: "recent_games",
        name: "Recent Games",
        description: "Games played in the last 2 weeks",
        configOptions: [
        {
          key: "recent_games_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "recent_games_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Games"
        },
        {
          key: "recent_games_max",
          label: "Maximum games",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 games",
          tooltip: "Maximum number of recent games to display. Games are ordered by most recently played."
        },
        {
          key: "recent_games_style",
          label: "Display style",
          type: "select",
          defaultValue: "list",
          description: "Choose how games are displayed",
          options: [
            { value: "list", label: "List" },
            { value: "compact", label: "Compact Grid (5 per row)" }
          ]
        }
        ]
      },
      {
        id: "top_games",
        name: "Top Games",
        description: "Most played games by total playtime",
        configOptions: [
        {
          key: "top_games_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false
        },
        {
          key: "top_games_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Games"
        },
        {
          key: "top_games_max",
          label: "Maximum games",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 games",
          tooltip: "Maximum number of top games to display. Games are ordered by total playtime (most played first)."
        },
        {
          key: "top_games_style",
          label: "Display style",
          type: "select",
          defaultValue: "list",
          description: "Choose how games are displayed",
          options: [
            { value: "list", label: "List" },
            { value: "compact", label: "Compact Grid (5 per row)" }
          ]
        }
        ]
      }
    ],
    exampleConfig: {
      "enabled": true,
      "sections": [
        "statistics",
        "recent_games",
        "top_games"
      ]
    },
  },
} as const satisfies Record<string, PluginMetadata>

/**
 * Helper functions para trabalhar com metadata
 */

export function getPluginMetadata(pluginName: string): PluginMetadata | undefined {
  return (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
}

export function getAllPluginsMetadata(): PluginMetadata[] {
  return Object.values(PLUGINS_METADATA)
}

export function getPluginSections(pluginName: string): PluginSection[] {
  const plugin = (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
  return plugin?.sections || []
}

export function getPluginCategory(pluginName: string): PluginCategory | undefined {
  return (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]?.category
}

export function getPluginsByCategory(category: PluginCategory): PluginMetadata[] {
  return Object.values(PLUGINS_METADATA).filter((plugin) => plugin.category === category)
}

/**
 * Retorna plugins agrupados por categoria
 */
export function getPluginsGroupedByCategory(): Record<PluginCategory, PluginMetadata[]> {
  const grouped: Record<PluginCategory, PluginMetadata[]> = {
    coding: [],
    music: [],
    anime: [],
    gaming: [],
  }
  
  Object.values(PLUGINS_METADATA).forEach((plugin) => {
    grouped[plugin.category].push(plugin)
  })
  
  return grouped
}

/**
 * Retorna as opções de configuração de uma seção específica
 */
export function getSectionConfigOptions(
  pluginName: string,
  sectionId: string
): SectionConfigOption[] {
  const plugin = (PLUGINS_METADATA as Record<string, PluginMetadata>)[pluginName]
  if (!plugin) {
    return []
  }
  
  const section = plugin.sections.find((s) => s.id === sectionId)
  return section?.configOptions || []
}

/**
 * Valida se um nome de plugin é válido
 */
export function isValidPluginName(name: string): name is keyof typeof PLUGINS_METADATA {
  return name in PLUGINS_METADATA
}

/**
 * Valida se uma categoria é válida
 */
export function isValidCategory(category: string): category is PluginCategory {
  return ['coding', 'music', 'anime', 'gaming'].includes(category)
}

/**
 * Valida se um objeto é um PluginMetadata válido
 */
export function isValidPluginMetadata(obj: any): obj is PluginMetadata {
  if (!obj || typeof obj !== 'object') {
    return false
  }
  
  return (
    typeof obj.name === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.description === 'string' &&
    isValidCategory(obj.category) &&
    typeof obj.icon === 'string' &&
    Array.isArray(obj.requiredFields) &&
    Array.isArray(obj.essentialConfigKeys) &&
    Array.isArray(obj.essentialConfigKeysMetadata) &&
    Array.isArray(obj.sections)
  )
}
