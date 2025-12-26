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
  description: "Mostre suas estatísticas do GitHub",
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
      helpUrl:
        "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
      docKey: "github.pat",
    },
  ],
  sections: [
    {
      id: "profile",
      name: "Profile",
      description: "Perfil do usuário com avatar e estatísticas básicas",
      configOptions: [
        {
          key: "profile_hide_title",
          label: "Hide title",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "profile_title",
          label: "Title",
          type: "string",
          defaultValue: "Profile",
        },
        {
          key: "profile_hide_avatar",
          label: "Hide avatar",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      id: "activity",
      name: "Activity",
      description: "Estatísticas de atividade (commits, PRs, issues)",
      configOptions: [
        {
          key: "activity_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "activity_title",
          label: "Título",
          type: "string",
          defaultValue: "Activity",
        },
      ],
    },
    {
      id: "repositories",
      name: "Repositories",
      description: "Lista de repositórios",
      configOptions: [
        {
          key: "repositories_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "repositories_title",
          label: "Título",
          type: "string",
          defaultValue: "Repositories",
        },
        {
          key: "repositories_use_private",
          label: "Incluir repositórios privados",
          type: "boolean",
          defaultValue: false,
          tooltip: "Se ativado, inclui repositórios privados na lista. Requer que o token GitHub tenha permissão 'repo' para acessar repositórios privados.",
        },
        {
          key: "repositories_max",
          label: "Máximo de repositórios",
          type: "number",
          defaultValue: 5,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 repositórios",
          tooltip: "Número máximo de repositórios que serão exibidos. Os repositórios são ordenados por estrelas (mais estrelados primeiro).",
        },
      ],
    },
    {
      id: "favorite_languages",
      name: "Favorite Languages",
      description: "Linguagens de programação mais usadas",
      configOptions: [
        {
          key: "favorite_languages_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "favorite_languages_title",
          label: "Título",
          type: "string",
          defaultValue: "Favorite Languages",
        },
        {
          key: "favorite_languages_max_languages",
          label: "Máximo de linguagens",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 linguagens",
          tooltip: "Número máximo de linguagens de programação que serão exibidas. As linguagens são ordenadas por quantidade de código (mais código primeiro).",
        },
        {
          key: "favorite_languages_ignore_languages",
          label: "Ignorar linguagens",
          type: "string",
          defaultValue: "",
          description: "Lista de linguagens separadas por vírgula para ignorar",
          tooltip: "Lista de linguagens que você quer ignorar na exibição. Separe por vírgula (ex: 'HTML, CSS, Markdown'). Linguagens ignoradas não aparecerão na lista.",
        },
      ],
    },
    {
      id: "favorite_license",
      name: "Favorite License",
      description: "Licença mais usada nos repositórios",
      configOptions: [
        {
          key: "favorite_license_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "favorite_license_title",
          label: "Título",
          type: "string",
          defaultValue: "Favorite License",
        },
      ],
    },
    {
      id: "calendar",
      name: "Calendar",
      description: "Calendário de contribuições",
      configOptions: [
        {
          key: "calendar_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "calendar_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Calendar",
        },
        {
          key: "calendar_years",
          label: "Anos",
          type: "string" as const,
          defaultValue: "",
          description: "Lista de anos separados por vírgula (ex: '2023,2024'). Deixe vazio para ano atual",
          tooltip: "Anos do calendário de contribuições a serem exibidos. Separe múltiplos anos por vírgula (ex: '2023,2024'). Deixe vazio para mostrar apenas o ano atual.",
        },
      ],
    },
    {
      id: "code_habits",
      name: "Code Habits",
      description: "Hábitos de código (horários, dias da semana)",
      configOptions: [
        {
          key: "code_habits_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "code_habits_title",
          label: "Título",
          type: "string",
          defaultValue: "Code Habits",
        },
        {
          key: "code_habits_hide_languages",
          label: "Ocultar linguagens",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "code_habits_hide_stats",
          label: "Ocultar estatísticas",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "code_habits_hide_weekdays",
          label: "Ocultar dias da semana",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "code_habits_hide_hours",
          label: "Ocultar horários",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "code_habits_hide_footer",
          label: "Ocultar rodapé",
          type: "boolean",
          defaultValue: false,
        },
      ],
    },
    {
      id: "starred_repositories",
      name: "Starred Repositories",
      description: "Repositórios favoritados (starred)",
      configOptions: [
        {
          key: "starred_repositories_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "starred_repositories_title",
          label: "Título",
          type: "string",
          defaultValue: "Starred Repositories",
        },
        {
          key: "starred_repositories_max",
          label: "Máximo de repositórios",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 repositórios",
          tooltip: "Número máximo de repositórios favoritados (starred) que serão exibidos. Os repositórios são ordenados por data de favoritação (mais recentes primeiro).",
        },
      ],
    },
    {
      id: "gists",
      name: "Gists",
      description: "Gists públicos do usuário",
      configOptions: [
        {
          key: "gists_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "gists_title",
          label: "Título",
          type: "string",
          defaultValue: "Gists",
        },
        {
          key: "gists_max",
          label: "Máximo de gists",
          type: "number",
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 gists",
          tooltip: "Número máximo de gists públicos que serão exibidos. Os gists são ordenados por data de criação (mais recentes primeiro).",
        },
      ],
    },
    {
      id: "stargazers",
      name: "Stargazers",
      description: "Total de estrelas recebidas nos repositórios",
      configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Ocultar título",
          type: "boolean",
          defaultValue: false,
        },
        {
          key: "stargazers_title",
          label: "Título",
          type: "string",
          defaultValue: "Stargazers",
        },
      ],
    },
    {
      id: "top_repositories",
      name: "Top Repositories",
      description: "Repositórios com mais estrelas (alias para stargazers)",
      configOptions: [
        {
          key: "stargazers_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "stargazers_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Top Repositories",
        },
      ],
    },
    {
      id: "star_lists",
      name: "Star Lists",
      description: "Listas de repositórios favoritados organizados",
      configOptions: [
        {
          key: "star_lists_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "star_lists_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Star Lists",
        },
        {
          key: "star_lists_max",
          label: "Máximo de listas",
          type: "number" as const,
          defaultValue: 1,
          min: 1,
          max: 20,
          step: 1,
          description: "Máximo 20 listas",
          tooltip: "Número máximo de listas de repositórios favoritados que serão exibidas. As listas são ordenadas por data de criação (mais recentes primeiro).",
        },
      ],
    },
    {
      id: "notable_contributions",
      name: "Notable Contributions",
      description: "Contribuições notáveis em repositórios",
      configOptions: [
        {
          key: "notable_contributions_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "notable_contributions_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Notable Contributions",
        },
        {
          key: "notable_contributions_max",
          label: "Máximo de contribuições",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 contribuições",
          tooltip: "Número máximo de contribuições notáveis que serão exibidas. Mostra suas contribuições mais importantes em repositórios open source.",
        },
      ],
    },
    {
      id: "recent_activity",
      name: "Recent Activity",
      description: "Atividades recentes do usuário",
      configOptions: [
        {
          key: "recent_activity_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "recent_activity_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Recent Activity",
        },
        {
          key: "recent_activity_max",
          label: "Máximo de atividades",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 atividades",
          tooltip: "Número máximo de atividades recentes que serão exibidas. Mostra commits, PRs, issues e outras atividades do seu perfil GitHub.",
        },
      ],
    },
    {
      id: "introduction",
      name: "Introduction",
      description: "Introdução do perfil do usuário",
      configOptions: [
        {
          key: "introduction_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "introduction_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Introduction",
        },
        {
          key: "introduction_custom_text",
          label: "Texto customizado",
          type: "string" as const,
          defaultValue: "",
          description: "Texto personalizado a ser exibido antes da bio",
        },
      ],
    },
    {
      id: "featured_repositories",
      name: "Featured Repositories",
      description: "Repositórios em destaque (requer URL do repositório)",
      configOptions: [
        {
          key: "featured_repositories_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "featured_repositories_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Featured Repositories",
        },
        {
          key: "featured_repositories_urls",
          label: "URLs dos repositórios",
          type: "string" as const,
          defaultValue: "",
          description: "URLs separadas por vírgula (ex: 'owner/repo1,owner/repo2'). Limite de 20 repositórios.",
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
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "sponsorships_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Sponsorships",
        },
        {
          key: "sponsorships_max",
          label: "Máximo de sponsorships",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 sponsorships",
          tooltip: "Número máximo de patrocínios que você faz que serão exibidos. Mostra os desenvolvedores/organizações que você patrocina no GitHub.",
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
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "sponsors_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Sponsors",
        },
        {
          key: "sponsors_max",
          label: "Máximo de sponsors",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 sponsors",
          tooltip: "Número máximo de patrocinadores que você tem que serão exibidos. Mostra as pessoas/organizações que patrocinam você no GitHub.",
        },
      ],
    },
    {
      id: "people",
      name: "People",
      description: "Pessoas relacionadas (followers, contributors, etc)",
      configOptions: [
        {
          key: "people_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "people_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "People",
        },
        {
          key: "people_type",
          label: "Tipo",
          type: "select" as const,
          defaultValue: "profile",
          options: [
            { value: "profile", label: "Profile (followers)" },
            { value: "repository", label: "Repository (contributors, stargazers, watchers, sponsors)" },
          ],
        },
        {
          key: "people_repository",
          label: "Repositório (apenas para tipo repository)",
          type: "string" as const,
          defaultValue: "",
          description: "Formato: owner/repo (ex: 'octocat/Hello-World')",
        },
        {
          key: "people_max",
          label: "Máximo de pessoas",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 pessoas",
          tooltip: "Número máximo de pessoas que você segue que serão exibidas. Mostra desenvolvedores que você segue no GitHub.",
        },
      ],
    },
    {
      id: "repository_contributors",
      name: "Repository Contributors",
      description: "Contribuidores de um repositório",
      configOptions: [
        {
          key: "repository_contributors_hide_title",
          label: "Ocultar título",
          type: "boolean" as const,
          defaultValue: false,
        },
        {
          key: "repository_contributors_title",
          label: "Título",
          type: "string" as const,
          defaultValue: "Contributors",
        },
        {
          key: "repository_contributors_repository",
          label: "Repositório",
          type: "string" as const,
          defaultValue: "",
          description: "Formato: owner/repo (ex: 'octocat/Hello-World')",
        },
        {
          key: "repository_contributors_max",
          label: "Máximo de contribuidores",
          type: "number" as const,
          defaultValue: 10,
          min: 1,
          max: 50,
          step: 1,
          description: "Máximo 50 contribuidores",
          tooltip: "Número máximo de contribuidores que serão exibidos. Mostra os principais contribuidores dos seus repositórios (ordenados por número de commits).",
        },
      ],
    },
  ],
  exampleConfig: {
    enabled: true,
    username: "octocat",
    sections: ["profile", "activity"],
  },
  defaultConfig: {
    enabled: false,
    sections: ["profile"],
    username: "", // Será preenchido com user_metadata.user_name se disponível
  },
  fieldDefaults: {
    username: "octocat", // Para exemplos/testes
  },
}
