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
export type PluginCategory = "coding" | "music" | "anime" | "gaming" | "repository"

/**
 * I18n key map for translatable fields
 */
export interface I18nKeyMap {
  label?: string
  description?: string
  tooltip?: string
  placeholder?: string
  defaultValue?: string // For string editables only
  options?: Record<string, string> // For select options
}

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
  i18nKey?: {
    label?: string
    placeholder?: string
    description?: string
  }
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
  i18nKey?: I18nKeyMap
}

/**
 * Available section of a plugin
 */
export interface PluginSection {
  id: string
  name: string
  description?: string
  i18nKey?: {
    name: string
    description?: string
  }
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
  i18nKey?: {
    displayName: string
    description: string
  }
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
        i18nKey: {
          name: "plugins.16personalities.sections.personality.name",
          description: "plugins.16personalities.sections.personality.description"
        },
        configOptions: [
        {
          key: "personality_url",
          label: "16Personalities Result URL",
          type: "string",
          defaultValue: "",
          description: "Paste your 16Personalities test result URL to automatically detect your type",
          placeholder: "https://www.16personalities.com/br/resultados/enfj-t/m/...",
          required: true,
          tooltip: "Paste the full URL from your 16Personalities test results page. The plugin will automatically extract your personality type from the URL.",
          i18nKey: {
            label: "plugins.16personalities.sections.personality.config.personality_url.label",
            description: "plugins.16personalities.sections.personality.config.personality_url.description",
            tooltip: "plugins.16personalities.sections.personality.config.personality_url.tooltip",
            placeholder: "plugins.16personalities.sections.personality.config.personality_url.placeholder"
          }
        },
        {
          key: "personality_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.16personalities.sections.personality.config.personality_hide_title.label"
          }
        },
        {
          key: "personality_title",
          label: "Title",
          type: "string",
          defaultValue: "Personality",
          i18nKey: {
            label: "plugins.16personalities.sections.personality.config.personality_title.label",
            defaultValue: "plugins.16personalities.sections.personality.config.personality_title.defaultValue"
          }
        },
        {
          key: "personality_show_description",
          label: "Show description",
          type: "boolean",
          defaultValue: true,
          description: "Show a short description of the personality type",
          i18nKey: {
            label: "plugins.16personalities.sections.personality.config.personality_show_description.label",
            description: "plugins.16personalities.sections.personality.config.personality_show_description.description"
          }
        },
        {
          key: "personality_show_link",
          label: "Show link",
          type: "boolean",
          defaultValue: true,
          description: "Show link to the personality type page on 16Personalities",
          i18nKey: {
            label: "plugins.16personalities.sections.personality.config.personality_show_link.label",
            description: "plugins.16personalities.sections.personality.config.personality_show_link.description"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.16personalities.displayName",
      description: "plugins.16personalities.description"
    },
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
        i18nKey: {
          name: "plugins.codeforces.sections.rating_rank.name",
          description: "plugins.codeforces.sections.rating_rank.description"
        },
        configOptions: [
        {
          key: "rating_rank_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codeforces.sections.rating_rank.config.rating_rank_hide_title.label"
          }
        },
        {
          key: "rating_rank_title",
          label: "Title",
          type: "string",
          defaultValue: "Rating & Rank",
          i18nKey: {
            label: "plugins.codeforces.sections.rating_rank.config.rating_rank_title.label",
            defaultValue: "plugins.codeforces.sections.rating_rank.config.rating_rank_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "contests_participated",
        name: "Contests Participated",
        description: "Display the number of contests you've participated in",
        i18nKey: {
          name: "plugins.codeforces.sections.contests_participated.name",
          description: "plugins.codeforces.sections.contests_participated.description"
        },
        configOptions: [
        {
          key: "contests_participated_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codeforces.sections.contests_participated.config.contests_participated_hide_title.label"
          }
        },
        {
          key: "contests_participated_title",
          label: "Title",
          type: "string",
          defaultValue: "Contests Participated",
          i18nKey: {
            label: "plugins.codeforces.sections.contests_participated.config.contests_participated_title.label",
            defaultValue: "plugins.codeforces.sections.contests_participated.config.contests_participated_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "problems_solved",
        name: "Problems Solved",
        description: "Display the number of problems solved by difficulty",
        i18nKey: {
          name: "plugins.codeforces.sections.problems_solved.name",
          description: "plugins.codeforces.sections.problems_solved.description"
        },
        configOptions: [
        {
          key: "problems_solved_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codeforces.sections.problems_solved.config.problems_solved_hide_title.label"
          }
        },
        {
          key: "problems_solved_title",
          label: "Title",
          type: "string",
          defaultValue: "Problems Solved",
          i18nKey: {
            label: "plugins.codeforces.sections.problems_solved.config.problems_solved_title.label",
            defaultValue: "plugins.codeforces.sections.problems_solved.config.problems_solved_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "recent_submissions",
        name: "Recent Submissions",
        description: "Display your recent problem submissions",
        i18nKey: {
          name: "plugins.codeforces.sections.recent_submissions.name",
          description: "plugins.codeforces.sections.recent_submissions.description"
        },
        configOptions: [
        {
          key: "recent_submissions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_hide_title.label"
          }
        },
        {
          key: "recent_submissions_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Submissions",
          i18nKey: {
            label: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_title.label",
            defaultValue: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_title.defaultValue"
          }
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
          tooltip: "Maximum number of recent submissions to display. Submissions are ordered by most recent.",
          i18nKey: {
            label: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_max.label",
            description: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_max.description",
            tooltip: "plugins.codeforces.sections.recent_submissions.config.recent_submissions_max.tooltip"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.codeforces.displayName",
      description: "plugins.codeforces.description"
    },
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
        i18nKey: {
          name: "plugins.codewars.sections.rank_honor.name",
          description: "plugins.codewars.sections.rank_honor.description"
        },
        configOptions: [
        {
          key: "rank_honor_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codewars.sections.rank_honor.config.rank_honor_hide_title.label"
          }
        },
        {
          key: "rank_honor_title",
          label: "Title",
          type: "string",
          defaultValue: "Rank & Honor",
          i18nKey: {
            label: "plugins.codewars.sections.rank_honor.config.rank_honor_title.label",
            defaultValue: "plugins.codewars.sections.rank_honor.config.rank_honor_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "completed_kata",
        name: "Completed Kata",
        description: "Display your recently completed kata",
        i18nKey: {
          name: "plugins.codewars.sections.completed_kata.name",
          description: "plugins.codewars.sections.completed_kata.description"
        },
        configOptions: [
        {
          key: "completed_kata_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codewars.sections.completed_kata.config.completed_kata_hide_title.label"
          }
        },
        {
          key: "completed_kata_title",
          label: "Title",
          type: "string",
          defaultValue: "Completed Kata",
          i18nKey: {
            label: "plugins.codewars.sections.completed_kata.config.completed_kata_title.label",
            defaultValue: "plugins.codewars.sections.completed_kata.config.completed_kata_title.defaultValue"
          }
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
          tooltip: "Maximum number of completed kata to display. Kata are ordered by most recently completed.",
          i18nKey: {
            label: "plugins.codewars.sections.completed_kata.config.completed_kata_max.label",
            description: "plugins.codewars.sections.completed_kata.config.completed_kata_max.description",
            tooltip: "plugins.codewars.sections.completed_kata.config.completed_kata_max.tooltip"
          }
        }
        ]
      },
      {
        id: "languages_proficiency",
        name: "Languages Proficiency",
        description: "Display your proficiency in different programming languages",
        i18nKey: {
          name: "plugins.codewars.sections.languages_proficiency.name",
          description: "plugins.codewars.sections.languages_proficiency.description"
        },
        configOptions: [
        {
          key: "languages_proficiency_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_hide_title.label"
          }
        },
        {
          key: "languages_proficiency_title",
          label: "Title",
          type: "string",
          defaultValue: "Languages Proficiency",
          i18nKey: {
            label: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_title.label",
            defaultValue: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_title.defaultValue"
          }
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
          tooltip: "Maximum number of languages to display. Languages are ordered by score (highest score first).",
          i18nKey: {
            label: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_max.label",
            description: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_max.description",
            tooltip: "plugins.codewars.sections.languages_proficiency.config.languages_proficiency_max.tooltip"
          }
        }
        ]
      },
      {
        id: "leaderboard_position",
        name: "Leaderboard Position",
        description: "Display your position on the global leaderboard",
        i18nKey: {
          name: "plugins.codewars.sections.leaderboard_position.name",
          description: "plugins.codewars.sections.leaderboard_position.description"
        },
        configOptions: [
        {
          key: "leaderboard_position_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.codewars.sections.leaderboard_position.config.leaderboard_position_hide_title.label"
          }
        },
        {
          key: "leaderboard_position_title",
          label: "Title",
          type: "string",
          defaultValue: "Leaderboard Position",
          i18nKey: {
            label: "plugins.codewars.sections.leaderboard_position.config.leaderboard_position_title.label",
            defaultValue: "plugins.codewars.sections.leaderboard_position.config.leaderboard_position_title.defaultValue"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.codewars.displayName",
      description: "plugins.codewars.description"
    },
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
        i18nKey: {
          name: "plugins.duolingo.sections.current_streak.name",
          description: "plugins.duolingo.sections.current_streak.description"
        },
        configOptions: [
        {
          key: "current_streak_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.duolingo.sections.current_streak.config.current_streak_hide_title.label"
          }
        },
        {
          key: "current_streak_title",
          label: "Title",
          type: "string",
          defaultValue: "Current Streak",
          i18nKey: {
            label: "plugins.duolingo.sections.current_streak.config.current_streak_title.label",
            defaultValue: "plugins.duolingo.sections.current_streak.config.current_streak_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "total_xp",
        name: "Total XP",
        description: "Display your total XP accumulated",
        i18nKey: {
          name: "plugins.duolingo.sections.total_xp.name",
          description: "plugins.duolingo.sections.total_xp.description"
        },
        configOptions: [
        {
          key: "total_xp_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.duolingo.sections.total_xp.config.total_xp_hide_title.label"
          }
        },
        {
          key: "total_xp_title",
          label: "Title",
          type: "string",
          defaultValue: "Total XP",
          i18nKey: {
            label: "plugins.duolingo.sections.total_xp.config.total_xp_title.label",
            defaultValue: "plugins.duolingo.sections.total_xp.config.total_xp_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "languages_learning",
        name: "Languages Learning",
        description: "Display languages you're learning with XP per language",
        i18nKey: {
          name: "plugins.duolingo.sections.languages_learning.name",
          description: "plugins.duolingo.sections.languages_learning.description"
        },
        configOptions: [
        {
          key: "languages_learning_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.duolingo.sections.languages_learning.config.languages_learning_hide_title.label"
          }
        },
        {
          key: "languages_learning_title",
          label: "Title",
          type: "string",
          defaultValue: "Languages Learning",
          i18nKey: {
            label: "plugins.duolingo.sections.languages_learning.config.languages_learning_title.label",
            defaultValue: "plugins.duolingo.sections.languages_learning.config.languages_learning_title.defaultValue"
          }
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
          tooltip: "Maximum number of languages that will be displayed. Languages are ordered by total XP (highest XP first).",
          i18nKey: {
            label: "plugins.duolingo.sections.languages_learning.config.languages_learning_max.label",
            description: "plugins.duolingo.sections.languages_learning.config.languages_learning_max.description",
            tooltip: "plugins.duolingo.sections.languages_learning.config.languages_learning_max.tooltip"
          }
        },
        {
          key: "languages_learning_hide_languages",
          label: "Hide languages",
          type: "array",
          defaultValue: [],
          description: "List of language names to hide (e.g., Japanese, French)",
          tooltip: "List of language names you want to hide from display. Type the exact language name (e.g., 'Japanese', 'French', 'Spanish') and press Enter to add.",
          i18nKey: {
            label: "plugins.duolingo.sections.languages_learning.config.languages_learning_hide_languages.label",
            description: "plugins.duolingo.sections.languages_learning.config.languages_learning_hide_languages.description",
            tooltip: "plugins.duolingo.sections.languages_learning.config.languages_learning_hide_languages.tooltip"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.duolingo.displayName",
      description: "plugins.duolingo.description"
    },
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
          docKey: "github.pat",
          i18nKey: {
            label: "plugins.github.essentialConfig.pat.label",
            placeholder: "plugins.github.essentialConfig.pat.placeholder",
            description: "plugins.github.essentialConfig.pat.description"
          }
        }
    ],
    sections: [
      {
        id: "profile",
        name: "Profile",
        description: "User profile with avatar and basic statistics",
        i18nKey: {
          name: "plugins.github.sections.profile.name",
          description: "plugins.github.sections.profile.description"
        },
        configOptions: [
        {
          key: "profile_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.profile.config.profile_hide_title.label"
          }
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string",
          defaultValue: "Profile",
          i18nKey: {
            label: "plugins.github.sections.profile.config.profile_title.label",
            defaultValue: "plugins.github.sections.profile.config.profile_title.defaultValue"
          }
        },
        {
          key: "profile_hide_avatar",
          label: "Hide avatar",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.profile.config.profile_hide_avatar.label"
          }
        }
        ]
      },
      {
        id: "activity",
        name: "Activity",
        description: "Activity statistics (commits, PRs, issues)",
        i18nKey: {
          name: "plugins.github.sections.activity.name",
          description: "plugins.github.sections.activity.description"
        },
        configOptions: [
        {
          key: "activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.activity.config.activity_hide_title.label"
          }
        },
        {
          key: "activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Activity",
          i18nKey: {
            label: "plugins.github.sections.activity.config.activity_title.label",
            defaultValue: "plugins.github.sections.activity.config.activity_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "repositories",
        name: "Repositories",
        description: "List of repositories",
        i18nKey: {
          name: "plugins.github.sections.repositories.name",
          description: "plugins.github.sections.repositories.description"
        },
        configOptions: [
        {
          key: "repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.repositories.config.repositories_hide_title.label"
          }
        },
        {
          key: "repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Repositories",
          i18nKey: {
            label: "plugins.github.sections.repositories.config.repositories_title.label",
            defaultValue: "plugins.github.sections.repositories.config.repositories_title.defaultValue"
          }
        },
        {
          key: "repositories_use_private",
          label: "Include private repositories",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.repositories.config.repositories_use_private.label"
          }
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
          tooltip: "Maximum number of repositories to display. Repositories are ordered by stars (most starred first).",
          i18nKey: {
            label: "plugins.github.sections.repositories.config.repositories_max.label",
            description: "plugins.github.sections.repositories.config.repositories_max.description",
            tooltip: "plugins.github.sections.repositories.config.repositories_max.tooltip"
          }
        }
        ]
      },
      {
        id: "favorite_languages",
        name: "Favorite Languages",
        description: "Most used programming languages",
        i18nKey: {
          name: "plugins.github.sections.favorite_languages.name",
          description: "plugins.github.sections.favorite_languages.description"
        },
        configOptions: [
        {
          key: "favorite_languages_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.favorite_languages.config.favorite_languages_hide_title.label"
          }
        },
        {
          key: "favorite_languages_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Languages",
          i18nKey: {
            label: "plugins.github.sections.favorite_languages.config.favorite_languages_title.label",
            defaultValue: "plugins.github.sections.favorite_languages.config.favorite_languages_title.defaultValue"
          }
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
          tooltip: "Maximum number of programming languages to display. Languages are ordered by total bytes of code (most used first).",
          i18nKey: {
            label: "plugins.github.sections.favorite_languages.config.favorite_languages_max_languages.label",
            description: "plugins.github.sections.favorite_languages.config.favorite_languages_max_languages.description",
            tooltip: "plugins.github.sections.favorite_languages.config.favorite_languages_max_languages.tooltip"
          }
        },
        {
          key: "favorite_languages_ignore_languages",
          label: "Ignore languages",
          type: "string",
          defaultValue: "",
          description: "Comma-separated list of languages to ignore",
          i18nKey: {
            label: "plugins.github.sections.favorite_languages.config.favorite_languages_ignore_languages.label",
            description: "plugins.github.sections.favorite_languages.config.favorite_languages_ignore_languages.description"
          }
        }
        ]
      },
      {
        id: "favorite_license",
        name: "Favorite License",
        description: "Most used license in repositories",
        i18nKey: {
          name: "plugins.github.sections.favorite_license.name",
          description: "plugins.github.sections.favorite_license.description"
        },
        configOptions: [
        {
          key: "favorite_license_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.favorite_license.config.favorite_license_hide_title.label"
          }
        },
        {
          key: "favorite_license_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite License",
          i18nKey: {
            label: "plugins.github.sections.favorite_license.config.favorite_license_title.label",
            defaultValue: "plugins.github.sections.favorite_license.config.favorite_license_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "calendar",
        name: "Calendar",
        description: "Contribution calendar",
        i18nKey: {
          name: "plugins.github.sections.calendar.name",
          description: "plugins.github.sections.calendar.description"
        },
        configOptions: [
        {
          key: "calendar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_hide_title.label"
          }
        },
        {
          key: "calendar_title",
          label: "Title",
          type: "string",
          defaultValue: "Calendar",
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_title.label",
            defaultValue: "plugins.github.sections.calendar.config.calendar_title.defaultValue"
          }
        },
        {
          key: "calendar_year_mode",
          label: "Year Mode",
          type: "select",
          defaultValue: "current_year",
          description: "Which year(s) to display in the contribution calendar",
          tooltip: "Select which year(s) to display: Last Year (previous year), Current Year (this year), or Full (multiple years up to max).",
          options: [
            { value: "last_year", label: "Last Year" },
            { value: "current_year", label: "Current Year" },
            { value: "last_6_months", label: "Last 6 Months" },
            { value: "full", label: "Full (Multiple Years)" }
          ],
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_year_mode.label",
            description: "plugins.github.sections.calendar.config.calendar_year_mode.description",
            tooltip: "plugins.github.sections.calendar.config.calendar_year_mode.tooltip",
            options: {
              "last_year": "plugins.github.sections.calendar.config.calendar_year_mode.options.last_year",
              "current_year": "plugins.github.sections.calendar.config.calendar_year_mode.options.current_year",
              "last_6_months": "plugins.github.sections.calendar.config.calendar_year_mode.options.last_6_months",
              "full": "plugins.github.sections.calendar.config.calendar_year_mode.options.full"
            }
          }
        },
        {
          key: "calendar_full_max_years",
          label: "Max Years (Full Mode)",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 10,
          description: "Maximum number of years to fetch when using 'full' mode",
          tooltip: "When calendar_year_mode is 'full', this sets the maximum number of years to fetch (starting from current year going back).",
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_full_max_years.label",
            description: "plugins.github.sections.calendar.config.calendar_full_max_years.description",
            tooltip: "plugins.github.sections.calendar.config.calendar_full_max_years.tooltip"
          }
        },
        {
          key: "calendar_hide_legends",
          label: "Hide Contribution Legend",
          type: "boolean",
          defaultValue: false,
          description: "Hide the contribution level legend (Less, No contributions, etc.)",
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_hide_legends.label",
            description: "plugins.github.sections.calendar.config.calendar_hide_legends.description"
          }
        },
        {
          key: "calendar_hide_weeks",
          label: "Hide Weekday Labels",
          type: "boolean",
          defaultValue: false,
          description: "Hide weekday labels (Sun, Mon, Tue, etc.) on the left side",
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_hide_weeks.label",
            description: "plugins.github.sections.calendar.config.calendar_hide_weeks.description"
          }
        },
        {
          key: "calendar_hide_months",
          label: "Hide Month Labels",
          type: "boolean",
          defaultValue: false,
          description: "Hide month labels (Jan, Feb, Mar, etc.) on the top",
          i18nKey: {
            label: "plugins.github.sections.calendar.config.calendar_hide_months.label",
            description: "plugins.github.sections.calendar.config.calendar_hide_months.description"
          }
        }
        ]
      },
      {
        id: "code_habits",
        name: "Code Habits",
        description: "Code habits (hours, days of the week)",
        i18nKey: {
          name: "plugins.github.sections.code_habits.name",
          description: "plugins.github.sections.code_habits.description"
        },
        configOptions: [
        {
          key: "code_habits_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_title.label"
          }
        },
        {
          key: "code_habits_title",
          label: "Title",
          type: "string",
          defaultValue: "Code Habits",
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_title.label",
            defaultValue: "plugins.github.sections.code_habits.config.code_habits_title.defaultValue"
          }
        },
        {
          key: "code_habits_hide_languages",
          label: "Hide languages",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_languages.label"
          }
        },
        {
          key: "code_habits_hide_stats",
          label: "Hide statistics",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_stats.label"
          }
        },
        {
          key: "code_habits_hide_weekdays",
          label: "Hide weekdays",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_weekdays.label"
          }
        },
        {
          key: "code_habits_hide_hours",
          label: "Hide hours",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_hours.label"
          }
        },
        {
          key: "code_habits_hide_footer",
          label: "Hide footer",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.code_habits.config.code_habits_hide_footer.label"
          }
        }
        ]
      },
      {
        id: "starred_repositories",
        name: "Starred Repositories",
        description: "Starred repositories",
        i18nKey: {
          name: "plugins.github.sections.starred_repositories.name",
          description: "plugins.github.sections.starred_repositories.description"
        },
        configOptions: [
        {
          key: "starred_repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.starred_repositories.config.starred_repositories_hide_title.label"
          }
        },
        {
          key: "starred_repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Starred Repositories",
          i18nKey: {
            label: "plugins.github.sections.starred_repositories.config.starred_repositories_title.label",
            defaultValue: "plugins.github.sections.starred_repositories.config.starred_repositories_title.defaultValue"
          }
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
          tooltip: "Maximum number of starred repositories to display. Repositories are ordered by most recently starred.",
          i18nKey: {
            label: "plugins.github.sections.starred_repositories.config.starred_repositories_max.label",
            description: "plugins.github.sections.starred_repositories.config.starred_repositories_max.description",
            tooltip: "plugins.github.sections.starred_repositories.config.starred_repositories_max.tooltip"
          }
        }
        ]
      },
      {
        id: "gists",
        name: "Gists",
        description: "User's public gists",
        i18nKey: {
          name: "plugins.github.sections.gists.name",
          description: "plugins.github.sections.gists.description"
        },
        configOptions: [
        {
          key: "gists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.gists.config.gists_hide_title.label"
          }
        },
        {
          key: "gists_title",
          label: "Title",
          type: "string",
          defaultValue: "Gists",
          i18nKey: {
            label: "plugins.github.sections.gists.config.gists_title.label",
            defaultValue: "plugins.github.sections.gists.config.gists_title.defaultValue"
          }
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
          tooltip: "Maximum number of gists to display. Gists are ordered by most recently created.",
          i18nKey: {
            label: "plugins.github.sections.gists.config.gists_max.label",
            description: "plugins.github.sections.gists.config.gists_max.description",
            tooltip: "plugins.github.sections.gists.config.gists_max.tooltip"
          }
        }
        ]
      },
      {
        id: "stargazers",
        name: "Stargazers",
        description: "Total stars received on repositories",
        i18nKey: {
          name: "plugins.github.sections.stargazers.name",
          description: "plugins.github.sections.stargazers.description"
        },
        configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.stargazers.config.stargazers_hide_title.label"
          }
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string",
          defaultValue: "Stargazers",
          i18nKey: {
            label: "plugins.github.sections.stargazers.config.stargazers_title.label",
            defaultValue: "plugins.github.sections.stargazers.config.stargazers_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "top_repositories",
        name: "Top Repositories",
        description: "Repositories with most stars (alias for stargazers)",
        i18nKey: {
          name: "plugins.github.sections.top_repositories.name",
          description: "plugins.github.sections.top_repositories.description"
        },
        configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.top_repositories.config.stargazers_hide_title.label"
          }
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Repositories",
          i18nKey: {
            label: "plugins.github.sections.top_repositories.config.stargazers_title.label",
            defaultValue: "plugins.github.sections.top_repositories.config.stargazers_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "star_lists",
        name: "Star Lists",
        description: "Organized lists of starred repositories",
        i18nKey: {
          name: "plugins.github.sections.star_lists.name",
          description: "plugins.github.sections.star_lists.description"
        },
        configOptions: [
        {
          key: "star_lists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.star_lists.config.star_lists_hide_title.label"
          }
        },
        {
          key: "star_lists_title",
          label: "Title",
          type: "string",
          defaultValue: "Star Lists",
          i18nKey: {
            label: "plugins.github.sections.star_lists.config.star_lists_title.label",
            defaultValue: "plugins.github.sections.star_lists.config.star_lists_title.defaultValue"
          }
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
          tooltip: "Maximum number of star lists to display. Lists are ordered by most recently created.",
          i18nKey: {
            label: "plugins.github.sections.star_lists.config.star_lists_max.label",
            description: "plugins.github.sections.star_lists.config.star_lists_max.description",
            tooltip: "plugins.github.sections.star_lists.config.star_lists_max.tooltip"
          }
        }
        ]
      },
      {
        id: "notable_contributions",
        name: "Notable Contributions",
        description: "Notable contributions to repositories",
        i18nKey: {
          name: "plugins.github.sections.notable_contributions.name",
          description: "plugins.github.sections.notable_contributions.description"
        },
        configOptions: [
        {
          key: "notable_contributions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.notable_contributions.config.notable_contributions_hide_title.label"
          }
        },
        {
          key: "notable_contributions_title",
          label: "Title",
          type: "string",
          defaultValue: "Notable Contributions",
          i18nKey: {
            label: "plugins.github.sections.notable_contributions.config.notable_contributions_title.label",
            defaultValue: "plugins.github.sections.notable_contributions.config.notable_contributions_title.defaultValue"
          }
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
          tooltip: "Maximum number of notable contributions to display. Contributions are ordered by most recent.",
          i18nKey: {
            label: "plugins.github.sections.notable_contributions.config.notable_contributions_max.label",
            description: "plugins.github.sections.notable_contributions.config.notable_contributions_max.description",
            tooltip: "plugins.github.sections.notable_contributions.config.notable_contributions_max.tooltip"
          }
        }
        ]
      },
      {
        id: "recent_activity",
        name: "Recent Activity",
        description: "User's recent activity",
        i18nKey: {
          name: "plugins.github.sections.recent_activity.name",
          description: "plugins.github.sections.recent_activity.description"
        },
        configOptions: [
        {
          key: "recent_activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.recent_activity.config.recent_activity_hide_title.label"
          }
        },
        {
          key: "recent_activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Activity",
          i18nKey: {
            label: "plugins.github.sections.recent_activity.config.recent_activity_title.label",
            defaultValue: "plugins.github.sections.recent_activity.config.recent_activity_title.defaultValue"
          }
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
          tooltip: "Maximum number of recent activities to display. Activities are ordered by most recent.",
          i18nKey: {
            label: "plugins.github.sections.recent_activity.config.recent_activity_max.label",
            description: "plugins.github.sections.recent_activity.config.recent_activity_max.description",
            tooltip: "plugins.github.sections.recent_activity.config.recent_activity_max.tooltip"
          }
        }
        ]
      },
      {
        id: "introduction",
        name: "Introduction",
        description: "User profile introduction",
        i18nKey: {
          name: "plugins.github.sections.introduction.name",
          description: "plugins.github.sections.introduction.description"
        },
        configOptions: [
        {
          key: "introduction_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.introduction.config.introduction_hide_title.label"
          }
        },
        {
          key: "introduction_title",
          label: "Title",
          type: "string",
          defaultValue: "Introduction",
          i18nKey: {
            label: "plugins.github.sections.introduction.config.introduction_title.label",
            defaultValue: "plugins.github.sections.introduction.config.introduction_title.defaultValue"
          }
        },
        {
          key: "introduction_custom_text",
          label: "Custom text",
          type: "string",
          defaultValue: "",
          description: "Custom text to display before the bio",
          tooltip: "Optional custom text that will be displayed before the user's bio. Leave empty to only show the bio.",
          i18nKey: {
            label: "plugins.github.sections.introduction.config.introduction_custom_text.label",
            description: "plugins.github.sections.introduction.config.introduction_custom_text.description",
            tooltip: "plugins.github.sections.introduction.config.introduction_custom_text.tooltip"
          }
        }
        ]
      },
      {
        id: "featured_repositories",
        name: "Featured Repositories",
        description: "Featured repositories (requires repository URL)",
        i18nKey: {
          name: "plugins.github.sections.featured_repositories.name",
          description: "plugins.github.sections.featured_repositories.description"
        },
        configOptions: [
        {
          key: "featured_repositories_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.featured_repositories.config.featured_repositories_hide_title.label"
          }
        },
        {
          key: "featured_repositories_title",
          label: "Title",
          type: "string",
          defaultValue: "Featured Repositories",
          i18nKey: {
            label: "plugins.github.sections.featured_repositories.config.featured_repositories_title.label",
            defaultValue: "plugins.github.sections.featured_repositories.config.featured_repositories_title.defaultValue"
          }
        },
        {
          key: "featured_repositories_urls",
          label: "Repository URLs",
          type: "string",
          defaultValue: "",
          description: "Comma-separated repository URLs (e.g., 'owner/repo1,owner/repo2'). Maximum 20 repositories.",
          tooltip: "Enter repository URLs in the format 'owner/repo'. Separate multiple repositories with commas. Maximum 20 repositories can be featured.",
          i18nKey: {
            label: "plugins.github.sections.featured_repositories.config.featured_repositories_urls.label",
            description: "plugins.github.sections.featured_repositories.config.featured_repositories_urls.description",
            tooltip: "plugins.github.sections.featured_repositories.config.featured_repositories_urls.tooltip"
          }
        }
        ]
      },
      {
        id: "sponsorships",
        name: "GitHub Sponsorships",
        description: "Sponsorships do GitHub",
        i18nKey: {
          name: "plugins.github.sections.sponsorships.name",
          description: "plugins.github.sections.sponsorships.description"
        },
        configOptions: [
        {
          key: "sponsorships_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.sponsorships.config.sponsorships_hide_title.label"
          }
        },
        {
          key: "sponsorships_title",
          label: "Title",
          type: "string",
          defaultValue: "Sponsorships",
          i18nKey: {
            label: "plugins.github.sections.sponsorships.config.sponsorships_title.label",
            defaultValue: "plugins.github.sections.sponsorships.config.sponsorships_title.defaultValue"
          }
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
          tooltip: "Maximum number of sponsorships to display. Sponsorships are ordered by most recent.",
          i18nKey: {
            label: "plugins.github.sections.sponsorships.config.sponsorships_max.label",
            description: "plugins.github.sections.sponsorships.config.sponsorships_max.description",
            tooltip: "plugins.github.sections.sponsorships.config.sponsorships_max.tooltip"
          }
        }
        ]
      },
      {
        id: "sponsors",
        name: "GitHub Sponsors",
        description: "Sponsors do GitHub",
        i18nKey: {
          name: "plugins.github.sections.sponsors.name",
          description: "plugins.github.sections.sponsors.description"
        },
        configOptions: [
        {
          key: "sponsors_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.sponsors.config.sponsors_hide_title.label"
          }
        },
        {
          key: "sponsors_title",
          label: "Title",
          type: "string",
          defaultValue: "Sponsors",
          i18nKey: {
            label: "plugins.github.sections.sponsors.config.sponsors_title.label",
            defaultValue: "plugins.github.sections.sponsors.config.sponsors_title.defaultValue"
          }
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
          tooltip: "Maximum number of sponsors to display. Sponsors are ordered by most recent.",
          i18nKey: {
            label: "plugins.github.sections.sponsors.config.sponsors_max.label",
            description: "plugins.github.sections.sponsors.config.sponsors_max.description",
            tooltip: "plugins.github.sections.sponsors.config.sponsors_max.tooltip"
          }
        }
        ]
      },
      {
        id: "people",
        name: "People",
        description: "Related people (followers, contributors, etc)",
        i18nKey: {
          name: "plugins.github.sections.people.name",
          description: "plugins.github.sections.people.description"
        },
        configOptions: [
        {
          key: "people_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.people.config.people_hide_title.label"
          }
        },
        {
          key: "people_title",
          label: "Title",
          type: "string",
          defaultValue: "People",
          i18nKey: {
            label: "plugins.github.sections.people.config.people_title.label",
            defaultValue: "plugins.github.sections.people.config.people_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.github.sections.people.config.people_type.label",
            tooltip: "plugins.github.sections.people.config.people_type.tooltip",
            options: {
              "profile": "plugins.github.sections.people.config.people_type.options.profile",
              "repository": "plugins.github.sections.people.config.people_type.options.repository"
            }
          }
        },
        {
          key: "people_repository",
          label: "Repository (only for repository type)",
          type: "string",
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Required when type is 'repository'. Enter the repository in the format 'owner/repo'.",
          i18nKey: {
            label: "plugins.github.sections.people.config.people_repository.label",
            description: "plugins.github.sections.people.config.people_repository.description",
            tooltip: "plugins.github.sections.people.config.people_repository.tooltip"
          }
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
          tooltip: "Maximum number of people to display. People are ordered by most recent interaction.",
          i18nKey: {
            label: "plugins.github.sections.people.config.people_max.label",
            description: "plugins.github.sections.people.config.people_max.description",
            tooltip: "plugins.github.sections.people.config.people_max.tooltip"
          }
        }
        ]
      },
      {
        id: "repository_contributors",
        name: "Repository Contributors",
        description: "Contributors to a repository",
        i18nKey: {
          name: "plugins.github.sections.repository_contributors.name",
          description: "plugins.github.sections.repository_contributors.description"
        },
        configOptions: [
        {
          key: "repository_contributors_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github.sections.repository_contributors.config.repository_contributors_hide_title.label"
          }
        },
        {
          key: "repository_contributors_title",
          label: "Title",
          type: "string",
          defaultValue: "Contributors",
          i18nKey: {
            label: "plugins.github.sections.repository_contributors.config.repository_contributors_title.label",
            defaultValue: "plugins.github.sections.repository_contributors.config.repository_contributors_title.defaultValue"
          }
        },
        {
          key: "repository_contributors_repository",
          label: "Repository",
          type: "string",
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Enter the repository in the format 'owner/repo'. This field is required.",
          i18nKey: {
            label: "plugins.github.sections.repository_contributors.config.repository_contributors_repository.label",
            description: "plugins.github.sections.repository_contributors.config.repository_contributors_repository.description",
            tooltip: "plugins.github.sections.repository_contributors.config.repository_contributors_repository.tooltip"
          }
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
          tooltip: "Maximum number of contributors to display. Contributors are ordered by total contributions (most contributions first).",
          i18nKey: {
            label: "plugins.github.sections.repository_contributors.config.repository_contributors_max.label",
            description: "plugins.github.sections.repository_contributors.config.repository_contributors_max.description",
            tooltip: "plugins.github.sections.repository_contributors.config.repository_contributors_max.tooltip"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.github.displayName",
      description: "plugins.github.description"
    },
    exampleConfig: {
      "enabled": true,
      "username": "octocat",
      "sections": [
        "profile",
        "activity"
      ]
    },
  },

  github_repo: {
    name: "github_repo",
    displayName: "Repository",
    description: "Show a card with stats for a single GitHub repository",
    category: "repository",
    icon: "BookMarked",
    requiredFields: ["owner","repo"],
    essentialConfigKeys: ["pat"],
    essentialConfigKeysMetadata: [
        {
          key: "pat",
          label: "GitHub Classic Token",
          type: "password",
          placeholder: "ghp_...",
          description: "Reuses the same token configured for the GitHub plugin, if you already have one.",
          helpUrl: "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
          docKey: "github.pat",
          i18nKey: {
            label: "plugins.github_repo.essentialConfig.pat.label",
            placeholder: "plugins.github_repo.essentialConfig.pat.placeholder",
            description: "plugins.github_repo.essentialConfig.pat.description"
          }
        }
    ],
    sections: [
      {
        id: "banner",
        name: "Banner",
        description: "Header banner with owner avatar, repository name and description, tinted by the primary language",
        i18nKey: {
          name: "plugins.github_repo.sections.banner.name",
          description: "plugins.github_repo.sections.banner.description"
        },
        configOptions: [
        {
          key: "banner_show_description",
          label: "Show description",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.github_repo.sections.banner.config.banner_show_description.label"
          }
        }
        ]
      },
      {
        id: "insights",
        name: "Insights",
        description: "Star and fork counters, a real star-growth graph, language breakdown and topics",
        i18nKey: {
          name: "plugins.github_repo.sections.insights.name",
          description: "plugins.github_repo.sections.insights.description"
        },
        configOptions: [
        {
          key: "insights_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.insights_hide_title.label"
          }
        },
        {
          key: "insights_title",
          label: "Title",
          type: "string",
          defaultValue: "Insights",
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.insights_title.label",
            defaultValue: "plugins.github_repo.sections.insights.config.insights_title.defaultValue"
          }
        },
        {
          key: "insights_show_star_graph",
          label: "Show star growth graph",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.insights_show_star_graph.label"
          }
        },
        {
          key: "insights_show_languages",
          label: "Show language breakdown",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.insights_show_languages.label"
          }
        },
        {
          key: "insights_show_topics",
          label: "Show topics",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.insights_show_topics.label"
          }
        },
        {
          key: "max_topics",
          label: "Maximum topics",
          type: "number",
          defaultValue: 6,
          min: 0,
          max: 6,
          step: 1,
          description: "Maximum 6 topics",
          tooltip: "Topics beyond this limit are summarized as '+N more'.",
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.max_topics.label",
            description: "plugins.github_repo.sections.insights.config.max_topics.description",
            tooltip: "plugins.github_repo.sections.insights.config.max_topics.tooltip"
          }
        },
        {
          key: "max_languages",
          label: "Maximum languages",
          type: "number",
          defaultValue: 5,
          min: 0,
          max: 5,
          step: 1,
          tooltip: "Languages beyond this limit are omitted from the breakdown bar.",
          i18nKey: {
            label: "plugins.github_repo.sections.insights.config.max_languages.label",
            tooltip: "plugins.github_repo.sections.insights.config.max_languages.tooltip"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.github_repo.displayName",
      description: "plugins.github_repo.description"
    },
    exampleConfig: {},
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
          docKey: "lastfm.apiKey",
          i18nKey: {
            label: "plugins.lastfm.essentialConfig.apiKey.label",
            placeholder: "plugins.lastfm.essentialConfig.apiKey.placeholder",
            description: "plugins.lastfm.essentialConfig.apiKey.description"
          }
        },
        {
          key: "username",
          label: "LastFM Username",
          type: "text",
          placeholder: "your-username",
          description: "Your LastFM username",
          helpUrl: "https://www.last.fm/",
          docKey: "lastfm.username",
          i18nKey: {
            label: "plugins.lastfm.essentialConfig.username.label",
            placeholder: "plugins.lastfm.essentialConfig.username.placeholder",
            description: "plugins.lastfm.essentialConfig.username.description"
          }
        }
    ],
    sections: [
      {
        id: "recent_tracks",
        name: "Recent Tracks",
        description: "Recent tracks listened",
        i18nKey: {
          name: "plugins.lastfm.sections.recent_tracks.name",
          description: "plugins.lastfm.sections.recent_tracks.description"
        },
        configOptions: [
        {
          key: "recent_tracks_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_hide_title.label"
          }
        },
        {
          key: "recent_tracks_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Tracks",
          i18nKey: {
            label: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_title.label",
            defaultValue: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_title.defaultValue"
          }
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
          tooltip: "Maximum number of recent tracks to display. Tracks are ordered by most recently played.",
          i18nKey: {
            label: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_max.label",
            description: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_max.description",
            tooltip: "plugins.lastfm.sections.recent_tracks.config.recent_tracks_max.tooltip"
          }
        }
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        description: "General statistics from LastFM",
        i18nKey: {
          name: "plugins.lastfm.sections.statistics.name",
          description: "plugins.lastfm.sections.statistics.description"
        },
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.statistics.config.statistics_hide_title.label"
          }
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics",
          i18nKey: {
            label: "plugins.lastfm.sections.statistics.config.statistics_title.label",
            defaultValue: "plugins.lastfm.sections.statistics.config.statistics_title.defaultValue"
          }
        },
        {
          key: "statistics_hide_featured_track",
          label: "Hide featured track",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.statistics.config.statistics_hide_featured_track.label"
          }
        }
        ]
      },
      {
        id: "top_artists",
        name: "Top Artists",
        description: "Most listened artists",
        i18nKey: {
          name: "plugins.lastfm.sections.top_artists.name",
          description: "plugins.lastfm.sections.top_artists.description"
        },
        configOptions: [
        {
          key: "top_artists_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.top_artists.config.top_artists_hide_title.label"
          }
        },
        {
          key: "top_artists_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Artists",
          i18nKey: {
            label: "plugins.lastfm.sections.top_artists.config.top_artists_title.label",
            defaultValue: "plugins.lastfm.sections.top_artists.config.top_artists_title.defaultValue"
          }
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
          tooltip: "Maximum number of top artists to display. Artists are ordered by total play count (most played first).",
          i18nKey: {
            label: "plugins.lastfm.sections.top_artists.config.top_artists_max.label",
            description: "plugins.lastfm.sections.top_artists.config.top_artists_max.description",
            tooltip: "plugins.lastfm.sections.top_artists.config.top_artists_max.tooltip"
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_artists.config.top_artists_style.label",
            options: {
              "grid": "plugins.lastfm.sections.top_artists.config.top_artists_style.options.grid",
              "list": "plugins.lastfm.sections.top_artists.config.top_artists_style.options.list",
              "default": "plugins.lastfm.sections.top_artists.config.top_artists_style.options.default"
            }
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_artists.config.top_artists_period.label",
            options: {
              "overall": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.overall",
              "7day": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.7day",
              "1month": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.1month",
              "3month": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.3month",
              "6month": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.6month",
              "12month": "plugins.lastfm.sections.top_artists.config.top_artists_period.options.12month"
            }
          }
        }
        ]
      },
      {
        id: "top_albums",
        name: "Top Albums",
        description: "Most listened albums",
        i18nKey: {
          name: "plugins.lastfm.sections.top_albums.name",
          description: "plugins.lastfm.sections.top_albums.description"
        },
        configOptions: [
        {
          key: "top_albums_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.top_albums.config.top_albums_hide_title.label"
          }
        },
        {
          key: "top_albums_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Albums",
          i18nKey: {
            label: "plugins.lastfm.sections.top_albums.config.top_albums_title.label",
            defaultValue: "plugins.lastfm.sections.top_albums.config.top_albums_title.defaultValue"
          }
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
          tooltip: "Maximum number of top albums to display. Albums are ordered by total play count (most played first).",
          i18nKey: {
            label: "plugins.lastfm.sections.top_albums.config.top_albums_max.label",
            description: "plugins.lastfm.sections.top_albums.config.top_albums_max.description",
            tooltip: "plugins.lastfm.sections.top_albums.config.top_albums_max.tooltip"
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_albums.config.top_albums_style.label",
            tooltip: "plugins.lastfm.sections.top_albums.config.top_albums_style.tooltip",
            options: {
              "grid": "plugins.lastfm.sections.top_albums.config.top_albums_style.options.grid",
              "list": "plugins.lastfm.sections.top_albums.config.top_albums_style.options.list",
              "default": "plugins.lastfm.sections.top_albums.config.top_albums_style.options.default"
            }
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_albums.config.top_albums_period.label",
            tooltip: "plugins.lastfm.sections.top_albums.config.top_albums_period.tooltip",
            options: {
              "overall": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.overall",
              "7day": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.7day",
              "1month": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.1month",
              "3month": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.3month",
              "6month": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.6month",
              "12month": "plugins.lastfm.sections.top_albums.config.top_albums_period.options.12month"
            }
          }
        }
        ]
      },
      {
        id: "top_tracks",
        name: "Top Tracks",
        description: "Most listened tracks",
        i18nKey: {
          name: "plugins.lastfm.sections.top_tracks.name",
          description: "plugins.lastfm.sections.top_tracks.description"
        },
        configOptions: [
        {
          key: "top_tracks_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lastfm.sections.top_tracks.config.top_tracks_hide_title.label"
          }
        },
        {
          key: "top_tracks_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Tracks",
          i18nKey: {
            label: "plugins.lastfm.sections.top_tracks.config.top_tracks_title.label",
            defaultValue: "plugins.lastfm.sections.top_tracks.config.top_tracks_title.defaultValue"
          }
        },
        {
          key: "top_tracks_max",
          label: "Maximum tracks",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 tracks",
          i18nKey: {
            label: "plugins.lastfm.sections.top_tracks.config.top_tracks_max.label",
            description: "plugins.lastfm.sections.top_tracks.config.top_tracks_max.description"
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_tracks.config.top_tracks_style.label",
            tooltip: "plugins.lastfm.sections.top_tracks.config.top_tracks_style.tooltip",
            options: {
              "grid": "plugins.lastfm.sections.top_tracks.config.top_tracks_style.options.grid",
              "list": "plugins.lastfm.sections.top_tracks.config.top_tracks_style.options.list",
              "default": "plugins.lastfm.sections.top_tracks.config.top_tracks_style.options.default"
            }
          }
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
          ],
          i18nKey: {
            label: "plugins.lastfm.sections.top_tracks.config.top_tracks_period.label",
            tooltip: "plugins.lastfm.sections.top_tracks.config.top_tracks_period.tooltip",
            options: {
              "overall": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.overall",
              "7day": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.7day",
              "1month": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.1month",
              "3month": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.3month",
              "6month": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.6month",
              "12month": "plugins.lastfm.sections.top_tracks.config.top_tracks_period.options.12month"
            }
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.lastfm.displayName",
      description: "plugins.lastfm.description"
    },
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
          docKey: "lyfta.apiKey",
          i18nKey: {
            label: "plugins.lyfta.essentialConfig.apiKey.label",
            placeholder: "plugins.lyfta.essentialConfig.apiKey.placeholder",
            description: "plugins.lyfta.essentialConfig.apiKey.description"
          }
        }
    ],
    sections: [
      {
        id: "statistics",
        name: "Statistics",
        description: "General workout statistics",
        i18nKey: {
          name: "plugins.lyfta.sections.statistics.name",
          description: "plugins.lyfta.sections.statistics.description"
        },
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lyfta.sections.statistics.config.statistics_hide_title.label"
          }
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics",
          i18nKey: {
            label: "plugins.lyfta.sections.statistics.config.statistics_title.label",
            defaultValue: "plugins.lyfta.sections.statistics.config.statistics_title.defaultValue"
          }
        },
        {
          key: "statistics_period_days",
          label: "Period (days)",
          type: "number",
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days for period stats",
          i18nKey: {
            label: "plugins.lyfta.sections.statistics.config.statistics_period_days.label",
            description: "plugins.lyfta.sections.statistics.config.statistics_period_days.description"
          }
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
          ],
          i18nKey: {
            label: "plugins.lyfta.sections.statistics.config.weight_unit.label",
            description: "plugins.lyfta.sections.statistics.config.weight_unit.description",
            options: {
              "kg": "plugins.lyfta.sections.statistics.config.weight_unit.options.kg",
              "lbs": "plugins.lyfta.sections.statistics.config.weight_unit.options.lbs"
            }
          }
        }
        ]
      },
      {
        id: "recent_workouts",
        name: "Recent Workouts",
        description: "Recently performed workouts",
        i18nKey: {
          name: "plugins.lyfta.sections.recent_workouts.name",
          description: "plugins.lyfta.sections.recent_workouts.description"
        },
        configOptions: [
        {
          key: "recent_workouts_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lyfta.sections.recent_workouts.config.recent_workouts_hide_title.label"
          }
        },
        {
          key: "recent_workouts_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Workouts",
          i18nKey: {
            label: "plugins.lyfta.sections.recent_workouts.config.recent_workouts_title.label",
            defaultValue: "plugins.lyfta.sections.recent_workouts.config.recent_workouts_title.defaultValue"
          }
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
          tooltip: "Maximum number of recent workouts to display. Workouts are ordered by most recent.",
          i18nKey: {
            label: "plugins.lyfta.sections.recent_workouts.config.workouts_max.label",
            description: "plugins.lyfta.sections.recent_workouts.config.workouts_max.description",
            tooltip: "plugins.lyfta.sections.recent_workouts.config.workouts_max.tooltip"
          }
        }
        ]
      },
      {
        id: "exercises",
        name: "Exercises",
        description: "Most performed exercises",
        i18nKey: {
          name: "plugins.lyfta.sections.exercises.name",
          description: "plugins.lyfta.sections.exercises.description"
        },
        configOptions: [
        {
          key: "exercises_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_hide_title.label"
          }
        },
        {
          key: "exercises_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Exercises",
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_title.label",
            defaultValue: "plugins.lyfta.sections.exercises.config.exercises_title.defaultValue"
          }
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
          tooltip: "Maximum number of exercises to display. Exercises are ordered by total volume (highest volume first).",
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_max.label",
            description: "plugins.lyfta.sections.exercises.config.exercises_max.description",
            tooltip: "plugins.lyfta.sections.exercises.config.exercises_max.tooltip"
          }
        },
        {
          key: "exercises_show_1rm",
          label: "Show estimated 1RM",
          type: "boolean",
          defaultValue: true,
          description: "Display estimated one-rep max for each exercise",
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_show_1rm.label",
            description: "plugins.lyfta.sections.exercises.config.exercises_show_1rm.description"
          }
        },
        {
          key: "exercises_compact",
          label: "Compact mode",
          type: "boolean",
          defaultValue: false,
          description: "Hide avg/1RM, show only sessions count",
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_compact.label",
            description: "plugins.lyfta.sections.exercises.config.exercises_compact.description"
          }
        },
        {
          key: "exercises_hide_images",
          label: "Hide exercise images",
          type: "boolean",
          defaultValue: false,
          description: "Hide exercise images in the exercises list",
          i18nKey: {
            label: "plugins.lyfta.sections.exercises.config.exercises_hide_images.label",
            description: "plugins.lyfta.sections.exercises.config.exercises_hide_images.description"
          }
        }
        ]
      },
      {
        id: "overview",
        name: "Overview",
        description: "General workout summary for a period",
        i18nKey: {
          name: "plugins.lyfta.sections.overview.name",
          description: "plugins.lyfta.sections.overview.description"
        },
        configOptions: [
        {
          key: "overview_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_hide_title.label"
          }
        },
        {
          key: "overview_title",
          label: "Title",
          type: "string",
          defaultValue: "Overview",
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_title.label",
            defaultValue: "plugins.lyfta.sections.overview.config.overview_title.defaultValue"
          }
        },
        {
          key: "overview_period_days",
          label: "Period (days)",
          type: "number",
          defaultValue: 30,
          min: 7,
          max: 365,
          step: 1,
          description: "Number of days to include in overview",
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_period_days.label",
            description: "plugins.lyfta.sections.overview.config.overview_period_days.description"
          }
        },
        {
          key: "overview_show_volume",
          label: "Show total volume",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_show_volume.label"
          }
        },
        {
          key: "overview_show_duration",
          label: "Show total duration",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_show_duration.label"
          }
        },
        {
          key: "overview_show_weekly_avg",
          label: "Show weekly average",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.lyfta.sections.overview.config.overview_show_weekly_avg.label"
          }
        }
        ]
      },
      {
        id: "last_workout",
        name: "Last Workout",
        description: "Detailed view of the most recent workout",
        i18nKey: {
          name: "plugins.lyfta.sections.last_workout.name",
          description: "plugins.lyfta.sections.last_workout.description"
        },
        configOptions: [
        {
          key: "last_workout_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.lyfta.sections.last_workout.config.last_workout_hide_title.label"
          }
        },
        {
          key: "last_workout_title",
          label: "Title",
          type: "string",
          defaultValue: "Last Workout",
          i18nKey: {
            label: "plugins.lyfta.sections.last_workout.config.last_workout_title.label",
            defaultValue: "plugins.lyfta.sections.last_workout.config.last_workout_title.defaultValue"
          }
        },
        {
          key: "last_workout_show_body_weight",
          label: "Show body weight",
          type: "boolean",
          defaultValue: true,
          i18nKey: {
            label: "plugins.lyfta.sections.last_workout.config.last_workout_show_body_weight.label"
          }
        },
        {
          key: "last_workout_max_exercises",
          label: "Maximum exercises",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 10,
          step: 1,
          description: "Maximum exercises to display",
          i18nKey: {
            label: "plugins.lyfta.sections.last_workout.config.last_workout_max_exercises.label",
            description: "plugins.lyfta.sections.last_workout.config.last_workout_max_exercises.description"
          }
        },
        {
          key: "last_workout_compact",
          label: "Compact mode",
          type: "boolean",
          defaultValue: false,
          description: "Hide set details, show only volume",
          i18nKey: {
            label: "plugins.lyfta.sections.last_workout.config.last_workout_compact.label",
            description: "plugins.lyfta.sections.last_workout.config.last_workout_compact.description"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.lyfta.displayName",
      description: "plugins.lyfta.description"
    },
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
        i18nKey: {
          name: "plugins.myanimelist.sections.statistics.name",
          description: "plugins.myanimelist.sections.statistics.description"
        },
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.statistics.config.statistics_hide_title.label"
          }
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics",
          i18nKey: {
            label: "plugins.myanimelist.sections.statistics.config.statistics_title.label",
            defaultValue: "plugins.myanimelist.sections.statistics.config.statistics_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.myanimelist.sections.statistics.config.statistics_media.label",
            options: {
              "both": "plugins.myanimelist.sections.statistics.config.statistics_media.options.both",
              "anime": "plugins.myanimelist.sections.statistics.config.statistics_media.options.anime",
              "manga": "plugins.myanimelist.sections.statistics.config.statistics_media.options.manga"
            }
          }
        }
        ]
      },
      {
        id: "last_activity",
        name: "Last Activity",
        description: "Latest anime and manga updates",
        i18nKey: {
          name: "plugins.myanimelist.sections.last_activity.name",
          description: "plugins.myanimelist.sections.last_activity.description"
        },
        configOptions: [
        {
          key: "last_activity_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.last_activity.config.last_activity_hide_title.label"
          }
        },
        {
          key: "last_activity_title",
          label: "Title",
          type: "string",
          defaultValue: "Last Activity",
          i18nKey: {
            label: "plugins.myanimelist.sections.last_activity.config.last_activity_title.label",
            defaultValue: "plugins.myanimelist.sections.last_activity.config.last_activity_title.defaultValue"
          }
        },
        {
          key: "last_activity_max",
          label: "Max items",
          type: "number",
          defaultValue: 6,
          min: 1,
          max: 6,
          description: "Maximum number of activity items to display",
          i18nKey: {
            label: "plugins.myanimelist.sections.last_activity.config.last_activity_max.label",
            description: "plugins.myanimelist.sections.last_activity.config.last_activity_max.description"
          }
        },
        {
          key: "last_activity_hide_anime",
          label: "Hide anime",
          type: "boolean",
          defaultValue: false,
          description: "Hide anime updates from last activity",
          i18nKey: {
            label: "plugins.myanimelist.sections.last_activity.config.last_activity_hide_anime.label",
            description: "plugins.myanimelist.sections.last_activity.config.last_activity_hide_anime.description"
          }
        },
        {
          key: "last_activity_hide_manga",
          label: "Hide manga",
          type: "boolean",
          defaultValue: false,
          description: "Hide manga updates from last activity",
          i18nKey: {
            label: "plugins.myanimelist.sections.last_activity.config.last_activity_hide_manga.label",
            description: "plugins.myanimelist.sections.last_activity.config.last_activity_hide_manga.description"
          }
        }
        ]
      },
      {
        id: "statistics_simple",
        name: "Statistics Simple",
        description: "Simplified statistics",
        i18nKey: {
          name: "plugins.myanimelist.sections.statistics_simple.name",
          description: "plugins.myanimelist.sections.statistics_simple.description"
        },
        configOptions: [
        {
          key: "statistics_simple_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.statistics_simple.config.statistics_simple_hide_title.label"
          }
        },
        {
          key: "statistics_simple_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics",
          i18nKey: {
            label: "plugins.myanimelist.sections.statistics_simple.config.statistics_simple_title.label",
            defaultValue: "plugins.myanimelist.sections.statistics_simple.config.statistics_simple_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "anime_bar",
        name: "Anime Bar",
        description: "Horizontal bar chart for anime statistics",
        i18nKey: {
          name: "plugins.myanimelist.sections.anime_bar.name",
          description: "plugins.myanimelist.sections.anime_bar.description"
        },
        configOptions: [
        {
          key: "anime_bar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_bar.config.anime_bar_hide_title.label"
          }
        },
        {
          key: "anime_bar_title",
          label: "Title",
          type: "string",
          defaultValue: "Anime Statistics",
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_bar.config.anime_bar_title.label",
            defaultValue: "plugins.myanimelist.sections.anime_bar.config.anime_bar_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "manga_bar",
        name: "Manga Bar",
        description: "Horizontal bar chart for manga statistics",
        i18nKey: {
          name: "plugins.myanimelist.sections.manga_bar.name",
          description: "plugins.myanimelist.sections.manga_bar.description"
        },
        configOptions: [
        {
          key: "manga_bar_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_bar.config.manga_bar_hide_title.label"
          }
        },
        {
          key: "manga_bar_title",
          label: "Title",
          type: "string",
          defaultValue: "Manga Statistics",
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_bar.config.manga_bar_title.label",
            defaultValue: "plugins.myanimelist.sections.manga_bar.config.manga_bar_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "anime_favorites",
        name: "Anime Favorites",
        description: "Anime favorites with different list styles",
        i18nKey: {
          name: "plugins.myanimelist.sections.anime_favorites.name",
          description: "plugins.myanimelist.sections.anime_favorites.description"
        },
        configOptions: [
        {
          key: "anime_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_hide_title.label"
          }
        },
        {
          key: "anime_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Anime",
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_title.label",
            defaultValue: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.label",
            description: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.description",
            options: {
              "simple": "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.options.simple",
              "compact": "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.options.compact",
              "detailed": "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.options.detailed",
              "minimal": "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_list_style.options.minimal"
            }
          }
        },
        {
          key: "anime_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of anime favorites to display",
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_max.label",
            description: "plugins.myanimelist.sections.anime_favorites.config.anime_favorites_max.description"
          }
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.anime_favorites.config.favorites_hide_overlay.label"
          }
        }
        ]
      },
      {
        id: "manga_favorites",
        name: "Manga Favorites",
        description: "Manga favorites with different list styles",
        i18nKey: {
          name: "plugins.myanimelist.sections.manga_favorites.name",
          description: "plugins.myanimelist.sections.manga_favorites.description"
        },
        configOptions: [
        {
          key: "manga_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_hide_title.label"
          }
        },
        {
          key: "manga_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Manga",
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_title.label",
            defaultValue: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.label",
            description: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.description",
            options: {
              "simple": "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.options.simple",
              "compact": "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.options.compact",
              "detailed": "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.options.detailed",
              "minimal": "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_list_style.options.minimal"
            }
          }
        },
        {
          key: "manga_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of manga favorites to display",
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_max.label",
            description: "plugins.myanimelist.sections.manga_favorites.config.manga_favorites_max.description"
          }
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.manga_favorites.config.favorites_hide_overlay.label"
          }
        }
        ]
      },
      {
        id: "character_favorites",
        name: "Character Favorites",
        description: "Character favorites with different list styles",
        i18nKey: {
          name: "plugins.myanimelist.sections.character_favorites.name",
          description: "plugins.myanimelist.sections.character_favorites.description"
        },
        configOptions: [
        {
          key: "character_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.character_favorites.config.character_favorites_hide_title.label"
          }
        },
        {
          key: "character_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite Characters",
          i18nKey: {
            label: "plugins.myanimelist.sections.character_favorites.config.character_favorites_title.label",
            defaultValue: "plugins.myanimelist.sections.character_favorites.config.character_favorites_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.myanimelist.sections.character_favorites.config.character_favorites_list_style.label",
            description: "plugins.myanimelist.sections.character_favorites.config.character_favorites_list_style.description",
            options: {
              "simple": "plugins.myanimelist.sections.character_favorites.config.character_favorites_list_style.options.simple",
              "compact": "plugins.myanimelist.sections.character_favorites.config.character_favorites_list_style.options.compact"
            }
          }
        },
        {
          key: "character_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of character favorites to display",
          i18nKey: {
            label: "plugins.myanimelist.sections.character_favorites.config.character_favorites_max.label",
            description: "plugins.myanimelist.sections.character_favorites.config.character_favorites_max.description"
          }
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.character_favorites.config.favorites_hide_overlay.label"
          }
        }
        ]
      },
      {
        id: "people_favorites",
        name: "People Favorites",
        description: "People favorites (authors, directors, etc) with different list styles",
        i18nKey: {
          name: "plugins.myanimelist.sections.people_favorites.name",
          description: "plugins.myanimelist.sections.people_favorites.description"
        },
        configOptions: [
        {
          key: "people_favorites_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.people_favorites.config.people_favorites_hide_title.label"
          }
        },
        {
          key: "people_favorites_title",
          label: "Title",
          type: "string",
          defaultValue: "Favorite People",
          i18nKey: {
            label: "plugins.myanimelist.sections.people_favorites.config.people_favorites_title.label",
            defaultValue: "plugins.myanimelist.sections.people_favorites.config.people_favorites_title.defaultValue"
          }
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
          ],
          i18nKey: {
            label: "plugins.myanimelist.sections.people_favorites.config.people_favorites_list_style.label",
            description: "plugins.myanimelist.sections.people_favorites.config.people_favorites_list_style.description",
            options: {
              "simple": "plugins.myanimelist.sections.people_favorites.config.people_favorites_list_style.options.simple",
              "compact": "plugins.myanimelist.sections.people_favorites.config.people_favorites_list_style.options.compact"
            }
          }
        },
        {
          key: "people_favorites_max",
          label: "Max items",
          type: "number",
          defaultValue: 20,
          min: 1,
          max: 20,
          description: "Maximum number of people favorites to display",
          i18nKey: {
            label: "plugins.myanimelist.sections.people_favorites.config.people_favorites_max.label",
            description: "plugins.myanimelist.sections.people_favorites.config.people_favorites_max.description"
          }
        },
        {
          key: "favorites_hide_overlay",
          label: "Hide overlay (Simple style only)",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.myanimelist.sections.people_favorites.config.favorites_hide_overlay.label"
          }
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
    i18nKey: {
      displayName: "plugins.myanimelist.displayName",
      description: "plugins.myanimelist.description"
    },
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
        i18nKey: {
          name: "plugins.stackoverflow.sections.reputation.name",
          description: "plugins.stackoverflow.sections.reputation.description"
        },
        configOptions: [
        {
          key: "reputation_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.stackoverflow.sections.reputation.config.reputation_hide_title.label"
          }
        },
        {
          key: "reputation_title",
          label: "Title",
          type: "string",
          defaultValue: "Reputation",
          i18nKey: {
            label: "plugins.stackoverflow.sections.reputation.config.reputation_title.label",
            defaultValue: "plugins.stackoverflow.sections.reputation.config.reputation_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "badges",
        name: "Badges",
        description: "Display your badge counts (gold, silver, bronze)",
        i18nKey: {
          name: "plugins.stackoverflow.sections.badges.name",
          description: "plugins.stackoverflow.sections.badges.description"
        },
        configOptions: [
        {
          key: "badges_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.stackoverflow.sections.badges.config.badges_hide_title.label"
          }
        },
        {
          key: "badges_title",
          label: "Title",
          type: "string",
          defaultValue: "Badges",
          i18nKey: {
            label: "plugins.stackoverflow.sections.badges.config.badges_title.label",
            defaultValue: "plugins.stackoverflow.sections.badges.config.badges_title.defaultValue"
          }
        }
        ]
      },
      {
        id: "answers_questions",
        name: "Answers & Questions",
        description: "Display your total answers and questions count",
        i18nKey: {
          name: "plugins.stackoverflow.sections.answers_questions.name",
          description: "plugins.stackoverflow.sections.answers_questions.description"
        },
        configOptions: [
        {
          key: "answers_questions_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.stackoverflow.sections.answers_questions.config.answers_questions_hide_title.label"
          }
        },
        {
          key: "answers_questions_title",
          label: "Title",
          type: "string",
          defaultValue: "Answers & Questions",
          i18nKey: {
            label: "plugins.stackoverflow.sections.answers_questions.config.answers_questions_title.label",
            defaultValue: "plugins.stackoverflow.sections.answers_questions.config.answers_questions_title.defaultValue"
          }
        },
        {
          key: "answers_questions_hide_questions",
          label: "Hide questions count",
          type: "boolean",
          defaultValue: false,
          description: "Only show answers count",
          i18nKey: {
            label: "plugins.stackoverflow.sections.answers_questions.config.answers_questions_hide_questions.label",
            description: "plugins.stackoverflow.sections.answers_questions.config.answers_questions_hide_questions.description"
          }
        }
        ]
      },
      {
        id: "tags_expertise",
        name: "Tags Expertise",
        description: "Display your top tags by score",
        i18nKey: {
          name: "plugins.stackoverflow.sections.tags_expertise.name",
          description: "plugins.stackoverflow.sections.tags_expertise.description"
        },
        configOptions: [
        {
          key: "tags_expertise_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_hide_title.label"
          }
        },
        {
          key: "tags_expertise_title",
          label: "Title",
          type: "string",
          defaultValue: "Tags Expertise",
          i18nKey: {
            label: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_title.label",
            defaultValue: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_title.defaultValue"
          }
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
          tooltip: "Maximum number of tags to display. Tags are ordered by score (highest score first).",
          i18nKey: {
            label: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_max.label",
            description: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_max.description",
            tooltip: "plugins.stackoverflow.sections.tags_expertise.config.tags_expertise_max.tooltip"
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.stackoverflow.displayName",
      description: "plugins.stackoverflow.description"
    },
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
          docKey: "steam.apiKey",
          i18nKey: {
            label: "plugins.steam.essentialConfig.apiKey.label",
            placeholder: "plugins.steam.essentialConfig.apiKey.placeholder",
            description: "plugins.steam.essentialConfig.apiKey.description"
          }
        },
        {
          key: "steamId",
          label: "Steam ID64",
          type: "text",
          placeholder: "76561198000000000",
          description: "Your Steam ID64 (17 digits)",
          helpUrl: "https://steamid.io/",
          docKey: "steam.steamId",
          i18nKey: {
            label: "plugins.steam.essentialConfig.steamId.label",
            placeholder: "plugins.steam.essentialConfig.steamId.placeholder",
            description: "plugins.steam.essentialConfig.steamId.description"
          }
        }
    ],
    sections: [
      {
        id: "statistics",
        name: "Statistics",
        description: "General statistics from Steam",
        i18nKey: {
          name: "plugins.steam.sections.statistics.name",
          description: "plugins.steam.sections.statistics.description"
        },
        configOptions: [
        {
          key: "statistics_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.steam.sections.statistics.config.statistics_hide_title.label"
          }
        },
        {
          key: "statistics_title",
          label: "Title",
          type: "string",
          defaultValue: "Statistics",
          i18nKey: {
            label: "plugins.steam.sections.statistics.config.statistics_title.label",
            defaultValue: "plugins.steam.sections.statistics.config.statistics_title.defaultValue"
          }
        },
        {
          key: "statistics_show_featured",
          label: "Show featured game",
          type: "boolean",
          defaultValue: true,
          description: "Show the 'Destaque recente' card with the most played game in the last 2 weeks",
          i18nKey: {
            label: "plugins.steam.sections.statistics.config.statistics_show_featured.label",
            description: "plugins.steam.sections.statistics.config.statistics_show_featured.description"
          }
        }
        ]
      },
      {
        id: "recent_games",
        name: "Recent Games",
        description: "Games played in the last 2 weeks",
        i18nKey: {
          name: "plugins.steam.sections.recent_games.name",
          description: "plugins.steam.sections.recent_games.description"
        },
        configOptions: [
        {
          key: "recent_games_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.steam.sections.recent_games.config.recent_games_hide_title.label"
          }
        },
        {
          key: "recent_games_title",
          label: "Title",
          type: "string",
          defaultValue: "Recent Games",
          i18nKey: {
            label: "plugins.steam.sections.recent_games.config.recent_games_title.label",
            defaultValue: "plugins.steam.sections.recent_games.config.recent_games_title.defaultValue"
          }
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
          tooltip: "Maximum number of recent games to display. Games are ordered by most recently played.",
          i18nKey: {
            label: "plugins.steam.sections.recent_games.config.recent_games_max.label",
            description: "plugins.steam.sections.recent_games.config.recent_games_max.description",
            tooltip: "plugins.steam.sections.recent_games.config.recent_games_max.tooltip"
          }
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
          ],
          i18nKey: {
            label: "plugins.steam.sections.recent_games.config.recent_games_style.label",
            description: "plugins.steam.sections.recent_games.config.recent_games_style.description",
            options: {
              "list": "plugins.steam.sections.recent_games.config.recent_games_style.options.list",
              "compact": "plugins.steam.sections.recent_games.config.recent_games_style.options.compact"
            }
          }
        }
        ]
      },
      {
        id: "top_games",
        name: "Top Games",
        description: "Most played games by total playtime",
        i18nKey: {
          name: "plugins.steam.sections.top_games.name",
          description: "plugins.steam.sections.top_games.description"
        },
        configOptions: [
        {
          key: "top_games_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
          i18nKey: {
            label: "plugins.steam.sections.top_games.config.top_games_hide_title.label"
          }
        },
        {
          key: "top_games_title",
          label: "Title",
          type: "string",
          defaultValue: "Top Games",
          i18nKey: {
            label: "plugins.steam.sections.top_games.config.top_games_title.label",
            defaultValue: "plugins.steam.sections.top_games.config.top_games_title.defaultValue"
          }
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
          tooltip: "Maximum number of top games to display. Games are ordered by total playtime (most played first).",
          i18nKey: {
            label: "plugins.steam.sections.top_games.config.top_games_max.label",
            description: "plugins.steam.sections.top_games.config.top_games_max.description",
            tooltip: "plugins.steam.sections.top_games.config.top_games_max.tooltip"
          }
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
          ],
          i18nKey: {
            label: "plugins.steam.sections.top_games.config.top_games_style.label",
            description: "plugins.steam.sections.top_games.config.top_games_style.description",
            options: {
              "list": "plugins.steam.sections.top_games.config.top_games_style.options.list",
              "compact": "plugins.steam.sections.top_games.config.top_games_style.options.compact"
            }
          }
        }
        ]
      }
    ],
    i18nKey: {
      displayName: "plugins.steam.displayName",
      description: "plugins.steam.description"
    },
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
    repository: [],
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
  return ['coding', 'music', 'anime', 'gaming', 'repository'].includes(category)
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
