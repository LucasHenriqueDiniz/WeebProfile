<div align='center'>
<img src='.github/assets/project-banner.png' height='400' justify='center' />
</div>

# WeebProfile 🦀

A simple and customizable way to display code, anime, and music stats on your GitHub profile README — no GitHub Action or manual Gist setup required.

## 📝 Contents

- [How it works](#-how-it-works)
- [Available plugins](#-available-plugins)
- [Plugin gallery](#-plugin-gallery)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 How it works

1. Go to [weebprofile-dashboard.pages.dev](https://weebprofile-dashboard.pages.dev) and sign in (GitHub, Google or email).
2. Pick the plugins and sections you want, and customize the style (`default` or `terminal`) and colors.
3. The dashboard generates an SVG and hosts it for you — copy the markdown snippet it gives you.
4. Paste that snippet into your profile README (`github.com/<username>/<username>/README.md`).

Your SVG refreshes automatically on a schedule, and you can trigger a manual refresh from the dashboard at any time.

## 📦 Available plugins

| Plugin                                                    | Category | Description                                             |
| ---------------------------------------------------------- | -------- | -------------------------------------------------------- |
| [GitHub](docs/plugins.md#github)                          | Coding   | Repositories, activity, contribution calendar, and more |
| [Codeforces](docs/plugins.md#codeforces)                  | Coding   | Competitive programming rating and stats                |
| [Codewars](docs/plugins.md#codewars)                      | Coding   | Kata solving stats and rank                              |
| [Stack Overflow](docs/plugins.md#stackoverflow)            | Coding   | Reputation, badges, and activity                         |
| [Duolingo](docs/plugins.md#duolingo)                       | Coding   | Streaks, XP, and languages being learned                 |
| [16Personalities](docs/plugins.md#16personalities)         | Coding   | Personality type badge                                   |
| [LastFM](docs/plugins.md#lastfm)                           | Music    | Recent tracks, top artists/albums/tracks                 |
| [MyAnimeList](docs/plugins.md#myanimelist)                 | Anime    | Anime/manga stats, favorites, and recent activity        |
| [Steam](docs/plugins.md#steam)                             | Gaming   | Recent and most-played games, stats                      |
| [Lyfta](docs/plugins.md#lyfta)                             | Gaming   | Workout stats and recent exercises                       |

See the [plugin gallery](docs/plugins.md) for a full preview of every section, in both `default` and `terminal` styles.

## 🖼️ Plugin gallery

Every plugin section, rendered in both styles, is in [`docs/plugins.md`](docs/plugins.md). It's generated straight from the same `svg-generator` used in production, so what you see there is what you'll get.

## 🤝 Contributing

If you are interested in contributing, the following resources may interest you:

- [🤖 Agent/architecture guide](/AGENTS.md) — monorepo layout, how plugins work, and conventions
- [📜 License](/LICENSE)

Use [`💬 discussions`](https://github.com/LucasHenriqueDiniz/WeebProfile/discussions) for feedback, feature suggestions, bug reports, or help.

## 📜 License

```
Apache License 2.0
Copyright (c) 2024-2026
```
