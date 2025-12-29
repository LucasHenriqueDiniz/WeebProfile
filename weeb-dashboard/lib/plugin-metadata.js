export const PLUGINS_METADATA = {
    ["16personalities"]: {
        name: "16personalities",
        displayName: "16Personalities",
        description: "Display your 16Personalities type with emoji and link",
        category: "coding",
        icon: "UserCircle",
        requiredFields: ["personality_url"],
        essentialConfigKeys: [],
        essentialConfigKeysMetadata: [],
        sections: [
            {
                id: "personality",
                name: "Personality",
                description: "Display your 16Personalities personality type",
                configOptions: [
                    {
                        key: "personality_url",
                        label: "Result URL",
                        type: "string",
                        defaultValue: "",
                        description: "Paste your 16Personalities test result URL to automatically detect your type",
                        placeholder: "https://www.16personalities.com/br/resultados/enfj-t/m/...",
                        required: true,
                        helpUrl: "https://www.16personalities.com/free-personality-test",
                        tooltip: "Faça o quiz em https://www.16personalities.com/free-personality-test e copie o resultado (ex: https://www.16personalities.com/br/resultados/enfj-t/m/4lyvq4j0t)"
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "personality"
            ],
            "personality_url": ""
        },
        fieldDefaults: {},
    },
    codeforces: {
        name: "codeforces",
        displayName: "Codeforces",
        description: "Show your Codeforces competitive programming statistics",
        category: "coding",
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
                description: "Display number of contests participated",
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
                description: "Display problems solved by difficulty",
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
                description: "Display recent submissions",
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
                        defaultValue: 5,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 submissions",
                        tooltip: "Número máximo de submissões recentes que serão exibidas. Mostra as submissões mais recentes do seu perfil."
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
                "problems_solved",
                "recent_submissions"
            ]
        },
        defaultConfig: {
            "enabled": false,
            "sections": [
                "rating_rank"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "example"
        },
    },
    codewars: {
        name: "codewars",
        displayName: "Codewars",
        description: "Show your Codewars coding statistics",
        category: "coding",
        icon: "Code",
        requiredFields: ["username"],
        essentialConfigKeys: [],
        essentialConfigKeysMetadata: [],
        sections: [
            {
                id: "rank_honor",
                name: "Rank & Honor",
                description: "Display your current rank (kyu/dan) and honor points",
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
                description: "Display completed kata with difficulty",
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
                        defaultValue: 5,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 kata",
                        tooltip: "Número máximo de kata completados que serão exibidos na seção. Valores maiores podem aumentar o tempo de carregamento."
                    }
                ]
            },
            {
                id: "languages_proficiency",
                name: "Languages Proficiency",
                description: "Display proficiency by programming language",
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
                        defaultValue: 5,
                        min: 1,
                        max: 20,
                        step: 1,
                        description: "Maximum 20 languages",
                        tooltip: "Número máximo de linguagens de programação que serão exibidas, ordenadas por proficiência (maior XP primeiro)."
                    }
                ]
            },
            {
                id: "leaderboard_position",
                name: "Leaderboard Position",
                description: "Display your position in the leaderboard",
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
                "languages_proficiency",
                "leaderboard_position"
            ]
        },
        defaultConfig: {
            "enabled": false,
            "sections": [
                "rank_honor"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "example"
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
        essentialConfigKeysMetadata: [],
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
                        tooltip: "Número máximo de idiomas que serão exibidos. Os idiomas são ordenados por XP total (maior XP primeiro)."
                    },
                    {
                        key: "languages_learning_hide_languages",
                        label: "Hide languages",
                        type: "array",
                        defaultValue: [],
                        description: "List of language names to hide (e.g., Japanese, French)",
                        tooltip: "Lista de nomes de idiomas que você quer ocultar da exibição. Digite o nome exato do idioma (ex: 'Japanese', 'French', 'Spanish') e pressione Enter para adicionar."
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "current_streak"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "example"
        },
    },
    github: {
        name: "github",
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
                helpUrl: "https://github.com/settings/tokens/new?description=WeebProfile%20GitHub%20Plugin&scopes=read:user,repo,gist&default_expires_at=none",
                docKey: "github.pat"
            }
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
                description: "Estatísticas de atividade (commits, PRs, issues)",
                configOptions: [
                    {
                        key: "activity_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "activity_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Activity"
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "repositories_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Repositories"
                    },
                    {
                        key: "repositories_use_private",
                        label: "Incluir repositórios privados",
                        type: "boolean",
                        defaultValue: false,
                        tooltip: "Se ativado, inclui repositórios privados na lista. Requer que o token GitHub tenha permissão 'repo' para acessar repositórios privados."
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
                        tooltip: "Número máximo de repositórios que serão exibidos. Os repositórios são ordenados por estrelas (mais estrelados primeiro)."
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "favorite_languages_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Favorite Languages"
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
                        tooltip: "Número máximo de linguagens de programação que serão exibidas. As linguagens são ordenadas por quantidade de código (mais código primeiro)."
                    },
                    {
                        key: "favorite_languages_ignore_languages",
                        label: "Ignorar linguagens",
                        type: "string",
                        defaultValue: "",
                        description: "Lista de linguagens separadas por vírgula para ignorar",
                        tooltip: "Lista de linguagens que você quer ignorar na exibição. Separe por vírgula (ex: 'HTML, CSS, Markdown'). Linguagens ignoradas não aparecerão na lista."
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "favorite_license_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Favorite License"
                    }
                ]
            },
            {
                id: "calendar",
                name: "Calendar",
                description: "Calendário de contribuições",
                configOptions: [
                    {
                        key: "calendar_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "calendar_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Calendar"
                    },
                    {
                        key: "calendar_years",
                        label: "Anos",
                        type: "string",
                        defaultValue: "",
                        description: "Lista de anos separados por vírgula (ex: '2023,2024'). Deixe vazio para ano atual",
                        tooltip: "Anos do calendário de contribuições a serem exibidos. Separe múltiplos anos por vírgula (ex: '2023,2024'). Deixe vazio para mostrar apenas o ano atual."
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "code_habits_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Code Habits"
                    },
                    {
                        key: "code_habits_hide_languages",
                        label: "Ocultar linguagens",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "code_habits_hide_stats",
                        label: "Ocultar estatísticas",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "code_habits_hide_weekdays",
                        label: "Ocultar dias da semana",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "code_habits_hide_hours",
                        label: "Ocultar horários",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "code_habits_hide_footer",
                        label: "Ocultar rodapé",
                        type: "boolean",
                        defaultValue: false
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "starred_repositories_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Starred Repositories"
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
                        tooltip: "Número máximo de repositórios favoritados (starred) que serão exibidos. Os repositórios são ordenados por data de favoritação (mais recentes primeiro)."
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "gists_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Gists"
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
                        tooltip: "Número máximo de gists públicos que serão exibidos. Os gists são ordenados por data de criação (mais recentes primeiro)."
                    }
                ]
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
                        defaultValue: false
                    },
                    {
                        key: "stargazers_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Stargazers"
                    }
                ]
            },
            {
                id: "top_repositories",
                name: "Top Repositories",
                description: "Repositórios com mais estrelas (alias para stargazers)",
                configOptions: [
                    {
                        key: "stargazers_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "stargazers_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Top Repositories"
                    }
                ]
            },
            {
                id: "star_lists",
                name: "Star Lists",
                description: "Listas de repositórios favoritados organizados",
                configOptions: [
                    {
                        key: "star_lists_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "star_lists_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Star Lists"
                    },
                    {
                        key: "star_lists_max",
                        label: "Máximo de listas",
                        type: "number",
                        defaultValue: 1,
                        min: 1,
                        max: 20,
                        step: 1,
                        description: "Máximo 20 listas",
                        tooltip: "Número máximo de listas de repositórios favoritados que serão exibidas. As listas são ordenadas por data de criação (mais recentes primeiro)."
                    }
                ]
            },
            {
                id: "notable_contributions",
                name: "Notable Contributions",
                description: "Contribuições notáveis em repositórios",
                configOptions: [
                    {
                        key: "notable_contributions_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "notable_contributions_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Notable Contributions"
                    },
                    {
                        key: "notable_contributions_max",
                        label: "Máximo de contribuições",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 contribuições",
                        tooltip: "Número máximo de contribuições notáveis que serão exibidas. Mostra suas contribuições mais importantes em repositórios open source."
                    }
                ]
            },
            {
                id: "recent_activity",
                name: "Recent Activity",
                description: "Atividades recentes do usuário",
                configOptions: [
                    {
                        key: "recent_activity_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "recent_activity_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Recent Activity"
                    },
                    {
                        key: "recent_activity_max",
                        label: "Máximo de atividades",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 atividades",
                        tooltip: "Número máximo de atividades recentes que serão exibidas. Mostra commits, PRs, issues e outras atividades do seu perfil GitHub."
                    }
                ]
            },
            {
                id: "introduction",
                name: "Introduction",
                description: "Introdução do perfil do usuário",
                configOptions: [
                    {
                        key: "introduction_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "introduction_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Introduction"
                    },
                    {
                        key: "introduction_custom_text",
                        label: "Texto customizado",
                        type: "string",
                        defaultValue: "",
                        description: "Texto personalizado a ser exibido antes da bio"
                    }
                ]
            },
            {
                id: "featured_repositories",
                name: "Featured Repositories",
                description: "Repositórios em destaque (requer URL do repositório)",
                configOptions: [
                    {
                        key: "featured_repositories_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "featured_repositories_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Featured Repositories"
                    },
                    {
                        key: "featured_repositories_urls",
                        label: "URLs dos repositórios",
                        type: "string",
                        defaultValue: "",
                        description: "URLs separadas por vírgula (ex: 'owner/repo1,owner/repo2'). Limite de 20 repositórios."
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
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "sponsorships_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Sponsorships"
                    },
                    {
                        key: "sponsorships_max",
                        label: "Máximo de sponsorships",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 sponsorships",
                        tooltip: "Número máximo de patrocínios que você faz que serão exibidos. Mostra os desenvolvedores/organizações que você patrocina no GitHub."
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
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "sponsors_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Sponsors"
                    },
                    {
                        key: "sponsors_max",
                        label: "Máximo de sponsors",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 sponsors",
                        tooltip: "Número máximo de patrocinadores que você tem que serão exibidos. Mostra as pessoas/organizações que patrocinam você no GitHub."
                    }
                ]
            },
            {
                id: "people",
                name: "People",
                description: "Pessoas relacionadas (followers, contributors, etc)",
                configOptions: [
                    {
                        key: "people_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "people_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "People"
                    },
                    {
                        key: "people_type",
                        label: "Tipo",
                        type: "select",
                        defaultValue: "profile",
                        options: [
                            { value: "profile", label: "Profile (followers)" },
                            { value: "repository", label: "Repository (contributors, stargazers, watchers, sponsors)" }
                        ]
                    },
                    {
                        key: "people_repository",
                        label: "Repositório (apenas para tipo repository)",
                        type: "string",
                        defaultValue: "",
                        description: "Formato: owner/repo (ex: 'octocat/Hello-World')"
                    },
                    {
                        key: "people_max",
                        label: "Máximo de pessoas",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 pessoas",
                        tooltip: "Número máximo de pessoas que você segue que serão exibidas. Mostra desenvolvedores que você segue no GitHub."
                    }
                ]
            },
            {
                id: "repository_contributors",
                name: "Repository Contributors",
                description: "Contribuidores de um repositório",
                configOptions: [
                    {
                        key: "repository_contributors_hide_title",
                        label: "Ocultar título",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "repository_contributors_title",
                        label: "Título",
                        type: "string",
                        defaultValue: "Contributors"
                    },
                    {
                        key: "repository_contributors_repository",
                        label: "Repositório",
                        type: "string",
                        defaultValue: "",
                        description: "Formato: owner/repo (ex: 'octocat/Hello-World')"
                    },
                    {
                        key: "repository_contributors_max",
                        label: "Máximo de contribuidores",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Máximo 50 contribuidores",
                        tooltip: "Número máximo de contribuidores que serão exibidos. Mostra os principais contribuidores dos seus repositórios (ordenados por número de commits)."
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "profile"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "octocat"
        },
    },
    lastfm: {
        name: "lastfm",
        displayName: "LastFM",
        description: "Show your LastFM music statistics",
        category: "music",
        icon: "Music",
        requiredFields: ["username"],
        essentialConfigKeys: ["apiKey", "username"],
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
                        description: "Máximo 20 músicas",
                        tooltip: "Número máximo de músicas recentes que serão exibidas. Mostra as últimas músicas que você escutou no LastFM."
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
                        description: "Máximo 20 artistas",
                        tooltip: "Número máximo de artistas que serão exibidos. Valores maiores podem aumentar o tempo de carregamento."
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
                        tooltip: "Grid: exibe os artistas em formato de grade com imagens de perfil.\nList: exibe os artistas em formato de lista compacta."
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
                        tooltip: "Período de tempo para calcular os artistas mais ouvidos. 'All time' mostra seus artistas mais ouvidos de todos os tempos."
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
                        description: "Máximo 20 álbuns",
                        tooltip: "Número máximo de álbuns que serão exibidos. Valores maiores podem aumentar o tempo de carregamento."
                    },
                    {
                        key: "top_albums_style",
                        label: "Display style",
                        type: "select",
                        defaultValue: "grid",
                        options: [
                            { value: "grid", label: "Grid" },
                            { value: "list", label: "List" },
                            { value: "default", label: "Default (Grid)" }
                        ],
                        tooltip: "Grid: exibe os álbuns em formato de grade com capas de álbum.\nList: exibe os álbuns em formato de lista compacta."
                    },
                    {
                        key: "top_albums_period",
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
                        tooltip: "Período de tempo para calcular os álbuns mais ouvidos. 'All time' mostra seus álbuns mais ouvidos de todos os tempos."
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
                        description: "Maximum 20 tracks",
                        tooltip: "Número máximo de faixas que serão exibidas. Valores maiores podem aumentar o tempo de carregamento."
                    },
                    {
                        key: "top_tracks_style",
                        label: "Display style",
                        type: "select",
                        defaultValue: "grid",
                        options: [
                            { value: "grid", label: "Grid" },
                            { value: "list", label: "List" },
                            { value: "default", label: "Default (Grid)" }
                        ],
                        tooltip: "Grid: exibe as faixas em formato de grade com capas de álbum.\nList: exibe as faixas em formato de lista compacta."
                    },
                    {
                        key: "top_tracks_period",
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
                        tooltip: "Período de tempo para calcular as faixas mais ouvidas. 'All time' mostra suas faixas mais ouvidas de todos os tempos."
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "recent_tracks"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "exemplo"
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
                        description: "Maximum 20 workouts"
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
                        description: "Maximum 20 exercises"
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "statistics"
            ]
        },
        fieldDefaults: {},
    },
    myanimelist: {
        name: "myanimelist",
        displayName: "MyAnimeList",
        description: "Display your anime and manga statistics from MyAnimeList",
        category: "anime",
        icon: "BookOpen",
        requiredFields: ["username"],
        essentialConfigKeys: [],
        essentialConfigKeysMetadata: [],
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
                        defaultValue: "compact",
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
                        defaultValue: "compact",
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "statistics"
            ],
            "username": ""
        },
        fieldDefaults: {
            "username": "example"
        },
    },
    spotify: {
        name: "spotify",
        displayName: "Spotify",
        description: "Show your Spotify music statistics",
        category: "music",
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
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 tracks",
                        tooltip: "Número máximo de faixas recentes que serão exibidas. Mostra as últimas músicas que você tocou no Spotify."
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
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 artists",
                        tooltip: "Número máximo de artistas que serão exibidos. Valores maiores podem aumentar o tempo de carregamento."
                    },
                    {
                        key: "top_artists_style",
                        label: "Display style",
                        type: "select",
                        defaultValue: "default",
                        options: [
                            { value: "grid", label: "Grid" },
                            { value: "list", label: "List" },
                            { value: "default", label: "Default" }
                        ],
                        tooltip: "Grid: exibe os artistas em formato de grade com imagens de perfil.\nList: exibe os artistas em formato de lista compacta.\nDefault: usa o estilo padrão do tema."
                    },
                    {
                        key: "top_artists_period",
                        label: "Period",
                        type: "select",
                        defaultValue: "medium_term",
                        options: [
                            { value: "short_term", label: "Last 4 weeks" },
                            { value: "medium_term", label: "Last 6 months" },
                            { value: "long_term", label: "All time" }
                        ],
                        tooltip: "Período de tempo para calcular os artistas mais ouvidos.\nLast 4 weeks: últimas 4 semanas\nLast 6 months: últimos 6 meses\nAll time: todos os tempos"
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
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 tracks",
                        tooltip: "Número máximo de faixas que serão exibidas. Valores maiores podem aumentar o tempo de carregamento."
                    },
                    {
                        key: "top_tracks_style",
                        label: "Display style",
                        type: "select",
                        defaultValue: "default",
                        options: [
                            { value: "grid", label: "Grid" },
                            { value: "list", label: "List" },
                            { value: "default", label: "Default" }
                        ],
                        tooltip: "Grid: exibe as faixas em formato de grade com capas de álbum.\nList: exibe as faixas em formato de lista compacta.\nDefault: usa o estilo padrão do tema."
                    },
                    {
                        key: "top_tracks_period",
                        label: "Period",
                        type: "select",
                        defaultValue: "medium_term",
                        options: [
                            { value: "short_term", label: "Last 4 weeks" },
                            { value: "medium_term", label: "Last 6 months" },
                            { value: "long_term", label: "All time" }
                        ],
                        tooltip: "Período de tempo para calcular as faixas mais ouvidas.\nLast 4 weeks: últimas 4 semanas\nLast 6 months: últimos 6 meses\nAll time: todos os tempos"
                    }
                ]
            },
            {
                id: "currently_playing",
                name: "Currently Playing",
                description: "Track currently playing",
                configOptions: [
                    {
                        key: "currently_playing_hide_title",
                        label: "Hide title",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "currently_playing_title",
                        label: "Title",
                        type: "string",
                        defaultValue: "Now Playing"
                    }
                ]
            },
            {
                id: "playlists",
                name: "Playlists",
                description: "User playlists",
                configOptions: [
                    {
                        key: "playlists_hide_title",
                        label: "Hide title",
                        type: "boolean",
                        defaultValue: false
                    },
                    {
                        key: "playlists_title",
                        label: "Title",
                        type: "string",
                        defaultValue: "Playlists"
                    },
                    {
                        key: "playlists_max",
                        label: "Maximum playlists",
                        type: "number",
                        defaultValue: 10,
                        min: 1,
                        max: 50,
                        step: 1,
                        description: "Maximum 50 playlists",
                        tooltip: "Número máximo de playlists que serão exibidas. Mostra suas playlists públicas e privadas (se autorizado)."
                    }
                ]
            },
            {
                id: "profile",
                name: "Profile",
                description: "User profile information",
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
                    }
                ]
            }
        ],
        exampleConfig: {
            "enabled": true,
            "sections": [
                "recent_tracks",
                "top_artists"
            ]
        },
        defaultConfig: {
            "enabled": false,
            "sections": [
                "recent_tracks"
            ]
        },
        fieldDefaults: {},
    },
    stackoverflow: {
        name: "stackoverflow",
        displayName: "Stack Overflow",
        description: "Show your Stack Overflow statistics and expertise",
        category: "coding",
        icon: "Code",
        requiredFields: ["userId"],
        essentialConfigKeys: [],
        essentialConfigKeysMetadata: [],
        sections: [
            {
                id: "reputation",
                name: "Reputation",
                description: "Display your reputation and recent change",
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
                description: "Display your badges (gold, silver, bronze)",
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
                description: "Display total answers and questions",
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
                        defaultValue: "Stack Overflow Activity"
                    },
                    {
                        key: "answers_questions_hide_questions",
                        label: "Hide questions",
                        type: "boolean",
                        defaultValue: false
                    }
                ]
            },
            {
                id: "tags_expertise",
                name: "Tags Expertise",
                description: "Display top tags by score",
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
                        defaultValue: 5,
                        min: 1,
                        max: 20,
                        step: 1,
                        description: "Maximum 20 tags"
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
                "answers_questions",
                "tags_expertise"
            ]
        },
        defaultConfig: {
            "enabled": false,
            "sections": [
                "reputation"
            ],
            "userId": ""
        },
        fieldDefaults: {
            "userId": "123456"
        },
    },
    steam: {
        name: "steam",
        displayName: "Steam",
        description: "Show your Steam gaming statistics",
        category: "gaming",
        icon: "Gamepad2",
        requiredFields: [],
        essentialConfigKeys: ["apiKey", "steamId"],
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
                        description: "Maximum 20 games"
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
                        description: "Maximum 20 games"
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
        defaultConfig: {
            "enabled": false,
            "sections": [
                "statistics"
            ],
            "steamId": ""
        },
        fieldDefaults: {
            "steamId": "76561198000000000"
        },
    },
};