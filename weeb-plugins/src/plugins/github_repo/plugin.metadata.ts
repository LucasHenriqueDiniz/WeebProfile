/**
 * Metadata do Plugin Repository (github_repo)
 *
 * Este arquivo define as seções, configurações e opções do plugin github_repo.
 * É usado para gerar automaticamente o metadata.ts centralizado.
 *
 * NÃO edite metadata.ts manualmente - ele é gerado automaticamente a partir deste arquivo.
 *
 * Para atualizar:
 * 1. Edite este arquivo
 * 2. Execute: pnpm --filter @weeb/weeb-plugins run generate-metadata
 */

export const githubRepoPluginMetadata = {
  displayName: "Repository",
  description: "Show a card with stats for a single GitHub repository",
  category: "repository" as const,
  icon: "BookMarked",
  requiredFields: ["owner", "repo"],
  essentialConfigKeys: ["pat"],
  essentialConfigKeysMetadata: [
    {
      key: "pat",
      label: "GitHub Classic Token",
      type: "password",
      placeholder: "ghp_...",
      description: "Reuses the same token configured for the GitHub plugin, if you already have one.",
      helpUrl:
        "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
      docKey: "github.pat",
    },
  ],
  sections: [
    {
      id: "repository_card",
      name: "Repository Card",
      description: "Compact card with name, description, language, stars, forks, license and topics",
      configOptions: [
        {
          key: "repository_card_hide_title",
          label: "Hide title",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "repository_card_title",
          label: "Title",
          type: "string" as const,
          defaultValue: "Repository",
        },
        {
          key: "show_description",
          label: "Show description",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "show_language",
          label: "Show primary language",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "show_stats",
          label: "Show stars and forks",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "show_license",
          label: "Show license",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "show_topics",
          label: "Show topics",
          type: "boolean" as const,
          defaultValue: true,
        },
        {
          key: "max_topics",
          label: "Maximum topics",
          type: "number" as const,
          defaultValue: 6,
          min: 0,
          max: 6,
          step: 1,
          description: "Maximum 6 topics",
          tooltip: "Topics beyond this limit are summarized as '+N more'.",
        },
      ],
    },
  ],
}
