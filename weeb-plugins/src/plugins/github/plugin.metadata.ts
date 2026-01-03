/**
 * Metadata do Plugin GitHub
 *
 * Este arquivo define todas as seções, configurações e opções do plugin GitHub.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 *
 * NÃO edite metadata.ts manualmente - ele é gerado automaticamente a partir deste arquivo.
 *
 * Para adicionar novas seções:
 * 1. Adicione a seção aqui em sections[]
 * 2. Execute: pnpm generate-metadata
 * 3. O metadata.ts será atualizado automaticamente
 */

export const githubPluginMetadata = {
  displayName: "GitHub",
  description: "Show your GitHub statistics",
  category: "coding" as const,
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
      helpUrl:
        "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
      docKey: "github.pat",
    },
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
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Profile",
        },
        {
          key: "profile_hide_avatar",
          label: "Hide avatar",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "activity",
      name: "Activity",
      description: "Activity statistics (commits, PRs, issues)",
      configOptions: [
        {
          key: "activity_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "activity_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Activity",
        },
      ],
    },
    {
      id: "repositories",
      name: "Repositories",
      description: "List of repositories",
      configOptions: [
        {
          key: "repositories_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "repositories_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Repositories",
        },
        {
          key: "repositories_use_private",
          label: "Include private repositories",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "repositories_max",
          label: "Maximum repositories",
          type: "number" as const,
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 repositories",
          tooltip: "Maximum number of repositories to display. Repositories are ordered by stars (most starred first).",
        },
      ],
    },
    {
      id: "favorite_languages",
      name: "Favorite Languages",
      description: "Most used programming languages",
      configOptions: [
        {
          key: "favorite_languages_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "favorite_languages_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite Languages",
        },
        {
          key: "favorite_languages_max_languages",
          label: "Maximum languages",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 languages",
          tooltip:
            "Maximum number of programming languages to display. Languages are ordered by total bytes of code (most used first).",
        },
        {
          key: "favorite_languages_ignore_languages",
          label: "Ignorar linguagens",
          type: "string" as const,
          defaultValue: "",
          description: "Lista de linguagens separadas por vírgula para ignorar",
        },
      ],
    },
    {
      id: "favorite_license",
      name: "Favorite License",
      description: "Most used license in repositories",
      configOptions: [
        {
          key: "favorite_license_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "favorite_license_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Favorite License",
        },
      ],
    },
    {
      id: "calendar",
      name: "Calendar",
      description: "Contribution calendar",
      configOptions: [
        {
          key: "calendar_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "calendar_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Calendar",
        },
        {
          key: "calendar_years",
          label: "Years",
          type: "string" as const,
          defaultValue: "",
          description: "Comma-separated list of years (e.g., '2023,2024'). Leave empty for current year",
          tooltip:
            "Specify which years to display in the contribution calendar. If empty, only the current year is shown.",
        },
      ],
    },
    {
      id: "code_habits",
      name: "Code Habits",
      description: "Code habits (hours, days of the week)",
      configOptions: [
        {
          key: "code_habits_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "code_habits_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Code Habits",
        },
        {
          key: "code_habits_hide_languages",
          label: "Hide languages",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "code_habits_hide_stats",
          label: "Hide statistics",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "code_habits_hide_weekdays",
          label: "Hide weekdays",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "code_habits_hide_hours",
          label: "Hide hours",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "code_habits_hide_footer",
          label: "Hide footer",
          type: "boolean" as const,
          defaultValue: false,
        },
      ],
    },
    {
      id: "starred_repositories",
      name: "Starred Repositories",
      description: "Starred repositories",
      configOptions: [
        {
          key: "starred_repositories_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "starred_repositories_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Starred Repositories",
        },
        {
          key: "starred_repositories_max",
          label: "Maximum repositories",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 repositories",
          tooltip:
            "Maximum number of starred repositories to display. Repositories are ordered by most recently starred.",
        },
      ],
    },
    {
      id: "gists",
      name: "Gists",
      description: "User's public gists",
      configOptions: [
        {
          key: "gists_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "gists_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Gists",
        },
        {
          key: "gists_max",
          label: "Maximum gists",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 gists",
          tooltip: "Maximum number of gists to display. Gists are ordered by most recently created.",
        },
      ],
    },
    {
      id: "stargazers",
      name: "Stargazers",
      description: "Total stars received on repositories",
      configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Stargazers",
        },
      ],
    },
    {
      id: "top_repositories",
      name: "Top Repositories",
      description: "Repositories with most stars (alias for stargazers)",
      configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "stargazers_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Top Repositories",
        },
      ],
    },
    {
      id: "star_lists",
      name: "Star Lists",
      description: "Organized lists of starred repositories",
      configOptions: [
        {
          key: "star_lists_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "star_lists_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Star Lists",
        },
        {
          key: "star_lists_max",
          label: "Maximum lists",
          type: "number" as const,
          defaultValue: 1,
          min: 1,
          max: 20,
          step: 1,
          description: "Maximum 20 lists",
          tooltip: "Maximum number of star lists to display. Lists are ordered by most recently created.",
        },
      ],
    },
    {
      id: "notable_contributions",
      name: "Notable Contributions",
      description: "Notable contributions to repositories",
      configOptions: [
        {
          key: "notable_contributions_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "notable_contributions_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Notable Contributions",
        },
        {
          key: "notable_contributions_max",
          label: "Maximum contributions",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 contributions",
          tooltip: "Maximum number of notable contributions to display. Contributions are ordered by most recent.",
        },
      ],
    },
    {
      id: "recent_activity",
      name: "Recent Activity",
      description: "User's recent activity",
      configOptions: [
        {
          key: "recent_activity_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_activity_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Recent Activity",
        },
        {
          key: "recent_activity_max",
          label: "Maximum activities",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 activities",
          tooltip: "Maximum number of recent activities to display. Activities are ordered by most recent.",
        },
      ],
    },
    {
      id: "introduction",
      name: "Introduction",
      description: "User profile introduction",
      configOptions: [
        {
          key: "introduction_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "introduction_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Introduction",
        },
        {
          key: "introduction_custom_text",
          label: "Custom text",
          type: "string" as const,
          defaultValue: "",
          description: "Custom text to display before the bio",
          tooltip:
            "Optional custom text that will be displayed before the user's bio. Leave empty to only show the bio.",
        },
      ],
    },
    {
      id: "featured_repositories",
      name: "Featured Repositories",
      description: "Featured repositories (requires repository URL)",
      configOptions: [
        {
          key: "featured_repositories_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "featured_repositories_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Featured Repositories",
        },
        {
          key: "featured_repositories_urls",
          label: "Repository URLs",
          type: "string" as const,
          defaultValue: "",
          description: "Comma-separated repository URLs (e.g., 'owner/repo1,owner/repo2'). Maximum 20 repositories.",
          tooltip:
            "Enter repository URLs in the format 'owner/repo'. Separate multiple repositories with commas. Maximum 20 repositories can be featured.",
        },
      ],
    },
    {
      id: "sponsorships",
      name: "GitHub Sponsorships",
      description: "Sponsorships do GitHub",
      configOptions: [
        {
          key: "sponsorships_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "sponsorships_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Sponsorships",
        },
        {
          key: "sponsorships_max",
          label: "Maximum sponsorships",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 sponsorships",
          tooltip: "Maximum number of sponsorships to display. Sponsorships are ordered by most recent.",
        },
      ],
    },
    {
      id: "sponsors",
      name: "GitHub Sponsors",
      description: "Sponsors do GitHub",
      configOptions: [
        {
          key: "sponsors_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "sponsors_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Sponsors",
        },
        {
          key: "sponsors_max",
          label: "Maximum sponsors",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 sponsors",
          tooltip: "Maximum number of sponsors to display. Sponsors are ordered by most recent.",
        },
      ],
    },
    {
      id: "people",
      name: "People",
      description: "Related people (followers, contributors, etc)",
      configOptions: [
        {
          key: "people_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "people_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "People",
        },
        {
          key: "people_type",
          label: "Type",
          type: "select" as const,
          defaultValue: "profile",
          options: [
            { value: "profile", label: "Profile (followers)" },
            { value: "repository", label: "Repository (contributors, stargazers, watchers, sponsors)" },
          ],
          tooltip:
            "Select 'Profile' to show user followers, or 'Repository' to show repository-specific people (requires repository field).",
        },
        {
          key: "people_repository",
          label: "Repository (only for repository type)",
          type: "string" as const,
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Required when type is 'repository'. Enter the repository in the format 'owner/repo'.",
        },
        {
          key: "people_max",
          label: "Maximum people",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 people",
          tooltip: "Maximum number of people to display. People are ordered by most recent interaction.",
        },
      ],
    },
    {
      id: "repository_contributors",
      name: "Repository Contributors",
      description: "Contributors to a repository",
      configOptions: [
        {
          key: "repository_contributors_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "repository_contributors_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Contributors",
        },
        {
          key: "repository_contributors_repository",
          label: "Repository",
          type: "string" as const,
          defaultValue: "",
          description: "Format: owner/repo (e.g., 'octocat/Hello-World')",
          tooltip: "Enter the repository in the format 'owner/repo'. This field is required.",
        },
        {
          key: "repository_contributors_max",
          label: "Maximum contributors",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Maximum 50 contributors",
          tooltip:
            "Maximum number of contributors to display. Contributors are ordered by total contributions (most contributions first).",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "octocat",
    sections: ["profile", "activity"],
  },
}
