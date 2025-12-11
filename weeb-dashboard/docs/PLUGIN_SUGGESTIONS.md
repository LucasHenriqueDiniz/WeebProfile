# Sugestões de Plugins para WeebProfile

Este documento lista 15 plugins sugeridos para adicionar ao WeebProfile, priorizando aqueles com APIs bem documentadas e de fácil implementação.

## Plugins Muito Fáceis (⭐⭐⭐⭐⭐)

### 1. Spotify
**Categoria:** Música  
**Dificuldade:** ⭐ Muito Fácil  
**API:** Spotify Web API (OAuth2)  
**Documentação:** https://developer.spotify.com/documentation/web-api

**Como implementar:**
- Requer OAuth2 para autenticação
- Obter Client ID e Client Secret no Spotify Developer Dashboard
- Usar endpoints RESTful:
  - `/v1/me/top/tracks` - Top tracks do usuário
  - `/v1/me/top/artists` - Top artists
  - `/v1/me/player/recently-played` - Músicas recentes
  - `/v1/me/playlists` - Playlists do usuário

**Seções sugeridas:**
- Recent Tracks
- Top Artists
- Top Tracks
- Currently Playing
- Playlists

**Configurações essenciais:**
- `PLUGIN_SPOTIFY_CLIENT_ID` (text)
- `PLUGIN_SPOTIFY_CLIENT_SECRET` (password)
- `PLUGIN_SPOTIFY_REFRESH_TOKEN` (password) - obtido via OAuth flow

---

### 2. AniList
**Categoria:** Anime  
**Dificuldade:** ⭐ Muito Fácil  
**API:** GraphQL API (pública)  
**Documentação:** https://anilist.gitbook.io/anilist-apiv2-docs/

**Como implementar:**
- API GraphQL pública, sem autenticação obrigatória
- Endpoint: `https://graphql.anilist.co`
- Queries GraphQL para:
  - User stats (anime/manga watched/read)
  - Favorites (anime, manga, characters)
  - Activity feed
  - Currently watching/reading

**Seções sugeridas:**
- Statistics (anime/manga)
- Favorites (anime, manga, characters)
- Recent Activity
- Currently Watching/Reading

**Configurações essenciais:**
- `PLUGIN_ANILIST_USERNAME` (text)

---

### 3. Reddit
**Categoria:** Social  
**Dificuldade:** ⭐ Muito Fácil  
**API:** Reddit API (pública, OAuth opcional)  
**Documentação:** https://www.reddit.com/dev/api

**Como implementar:**
- API pública sem autenticação para dados públicos
- OAuth2 opcional para dados privados
- Endpoints JSON simples:
  - `/user/{username}/about.json` - User info
  - `/user/{username}/submitted.json` - Posts
  - `/user/{username}/comments.json` - Comments

**Seções sugeridas:**
- Karma Stats
- Recent Posts
- Recent Comments
- Top Subreddits

**Configurações essenciais:**
- `PLUGIN_REDDIT_USERNAME` (text)
- `PLUGIN_REDDIT_CLIENT_ID` (text, opcional para OAuth)
- `PLUGIN_REDDIT_CLIENT_SECRET` (password, opcional para OAuth)

---

### 4. Dev.to
**Categoria:** Coding  
**Dificuldade:** ⭐ Muito Fácil  
**API:** Dev.to API (pública)  
**Documentação:** https://docs.forem.com/api

**Como implementar:**
- API REST pública, sem autenticação
- Endpoint base: `https://dev.to/api`
- Endpoints:
  - `/articles?username={username}` - Artigos do usuário
  - `/users/by_username?url={username}` - Perfil do usuário

**Seções sugeridas:**
- Articles Published
- Total Reactions
- Followers Count
- Recent Articles

**Configurações essenciais:**
- `PLUGIN_DEVTO_USERNAME` (text)

---

### 5. Codewars
**Categoria:** Coding  
**Dificuldade:** ⭐ Muito Fácil  
**API:** Codewars API (pública)  
**Documentação:** https://dev.codewars.com/

**Como implementar:**
- API REST pública, sem autenticação
- Endpoint base: `https://www.codewars.com/api/v1`
- Endpoints:
  - `/users/{username}` - Perfil e estatísticas
  - `/users/{username}/code-challenges/completed` - Kata completados

**Seções sugeridas:**
- Rank & Honor
- Completed Kata
- Languages Proficiency
- Leaderboard Position

**Configurações essenciais:**
- `PLUGIN_CODEWARS_USERNAME` (text)

---

## Plugins Fáceis (⭐⭐⭐⭐)

### 6. WakaTime
**Categoria:** Coding  
**Dificuldade:** ⭐⭐ Fácil  
**API:** WakaTime API (token)  
**Documentação:** https://wakatime.com/developers

**Como implementar:**
- Requer API Key do WakaTime
- Endpoint base: `https://wakatime.com/api/v1`
- Endpoints:
  - `/users/current/stats/{range}` - Estatísticas de coding
  - `/users/current/summaries` - Resumos de atividade
  - `/users/current/languages` - Linguagens usadas

**Seções sugeridas:**
- Coding Stats (time, projects)
- Languages Breakdown
- Daily Activity
- Projects

**Configurações essenciais:**
- `PLUGIN_WAKATIME_API_KEY` (password)

---

### 7. Codeforces
**Categoria:** Coding  
**Dificuldade:** ⭐⭐ Fácil  
**API:** Codeforces API (pública)  
**Documentação:** https://codeforces.com/apiHelp

**Como implementar:**
- API REST pública, sem autenticação
- Endpoint base: `https://codeforces.com/api`
- Endpoints:
  - `/user.info?handles={username}` - Info do usuário
  - `/user.rating?handle={username}` - Rating history
  - `/user.status?handle={username}` - Submissões

**Seções sugeridas:**
- Rating & Rank
- Contests Participated
- Problems Solved
- Recent Submissions

**Configurações essenciais:**
- `PLUGIN_CODEFORCES_USERNAME` (text)

---

### 8. Stack Overflow
**Categoria:** Coding  
**Dificuldade:** ⭐⭐ Fácil  
**API:** Stack Exchange API (pública)  
**Documentação:** https://api.stackexchange.com/docs

**Como implementar:**
- API REST pública, sem autenticação obrigatória
- Endpoint base: `https://api.stackexchange.com/2.3`
- Endpoints:
  - `/users/{ids}` - Info do usuário
  - `/users/{ids}/reputation` - Reputação
  - `/users/{ids}/badges` - Badges
  - `/users/{ids}/answers` - Respostas

**Seções sugeridas:**
- Reputation
- Badges (gold, silver, bronze)
- Answers & Questions
- Tags Expertise

**Configurações essenciais:**
- `PLUGIN_STACKOVERFLOW_USER_ID` (text) - ID numérico do usuário

---

### 9. LeetCode
**Categoria:** Coding  
**Dificuldade:** ⭐⭐ Fácil (com scraping leve)  
**API:** GraphQL (pública, não oficial)  
**Documentação:** https://leetcode.com/graphql/ (explorar via DevTools)

**Como implementar:**
- GraphQL endpoint público: `https://leetcode.com/graphql/`
- Queries disponíveis (descobertas via DevTools):
  - `userProfile` - Perfil e estatísticas
  - `userContestRankingInfo` - Ranking em contests
  - `recentAcSubmissions` - Submissões recentes

**Seções sugeridas:**
- Problems Solved
- Contest Rating
- Acceptance Rate
- Recent Submissions

**Configurações essenciais:**
- `PLUGIN_LEETCODE_USERNAME` (text)

**Nota:** Pode requerer scraping leve ou uso de queries GraphQL descobertas via DevTools.

---

### 10. Twitter/X
**Categoria:** Social  
**Dificuldade:** ⭐⭐ Fácil  
**API:** Twitter API v2 (bearer token)  
**Documentação:** https://developer.twitter.com/en/docs/twitter-api

**Como implementar:**
- Requer Bearer Token (obtido no Twitter Developer Portal)
- Endpoint base: `https://api.twitter.com/2`
- Endpoints:
  - `/users/by/username/{username}` - User info
  - `/users/{id}/tweets` - Tweets do usuário
  - `/users/{id}/followers` - Seguidores

**Seções sugeridas:**
- Tweet Stats
- Recent Tweets
- Followers/Following
- Engagement Metrics

**Configurações essenciais:**
- `PLUGIN_TWITTER_BEARER_TOKEN` (password)
- `PLUGIN_TWITTER_USERNAME` (text)

---

## Plugins Médios (⭐⭐⭐)

### 11. HackerRank
**Categoria:** Coding  
**Dificuldade:** ⭐⭐⭐ Médio  
**API:** HackerRank API (limitada) / Scraping  
**Documentação:** https://www.hackerrank.com/api (limitada)

**Como implementar:**
- API oficial limitada ou scraping do perfil público
- Scraping: `https://www.hackerrank.com/{username}`
- Dados disponíveis: Certificates, badges, skills, contest rankings

**Seções sugeridas:**
- Certificates
- Badges
- Skills
- Contest Rankings

**Configurações essenciais:**
- `PLUGIN_HACKERRANK_USERNAME` (text)

**Nota:** Requer scraping do perfil público, pois a API oficial é limitada.

---

### 12. Duolingo
**Categoria:** Aprendizado  
**Dificuldade:** ⭐⭐⭐ Médio  
**API:** Duolingo API (não oficial, mas estável)  
**Documentação:** https://github.com/KartikTalwar/Duolingo (não oficial)

**Como implementar:**
- API não oficial mas estável
- Endpoint: `https://www.duolingo.com/2017-06-30/users?username={username}`
- Retorna JSON com: streak, XP, languages, achievements

**Seções sugeridas:**
- Current Streak
- Total XP
- Languages Learning
- Achievements

**Configurações essenciais:**
- `PLUGIN_DUOLINGO_USERNAME` (text)

**Nota:** API não oficial, mas funcional. Pode quebrar se Duolingo mudar estrutura.

---

### 13. Letterboxd
**Categoria:** Filmes  
**Dificuldade:** ⭐⭐⭐ Médio  
**API:** RSS Feeds / Scraping  
**Documentação:** https://letterboxd.com/about/feeds/ (RSS)

**Como implementar:**
- Usar RSS feeds públicos ou scraping
- RSS: `https://letterboxd.com/{username}/rss/`
- Scraping: `https://letterboxd.com/{username}/` para dados detalhados

**Seções sugeridas:**
- Films Watched
- Films Rated
- Recent Activity
- Favorite Films

**Configurações essenciais:**
- `PLUGIN_LETTERBOXD_USERNAME` (text)

**Nota:** Requer parsing de RSS ou scraping do perfil público.

---

### 14. Goodreads
**Categoria:** Leitura  
**Dificuldade:** ⭐⭐⭐ Médio (Scraping)  
**API:** Descontinuada (2020)  
**Alternativa:** Scraping do perfil público

**Como implementar:**
- API foi descontinuada em 2020
- Scraping necessário: `https://www.goodreads.com/user/show/{user-id}`
- Dados disponíveis: Books read, currently reading, reviews, ratings

**Seções sugeridas:**
- Books Read
- Currently Reading
- Reading Challenge
- Recent Reviews

**Configurações essenciais:**
- `PLUGIN_GOODREADS_USER_ID` (text) - ID numérico do usuário

**Nota:** Requer scraping, pois a API foi descontinuada. Pode ser frágil a mudanças no site.

---

### 15. Discord
**Categoria:** Social  
**Dificuldade:** ⭐⭐⭐ Médio  
**API:** Discord API (bot token)  
**Documentação:** https://discord.com/developers/docs

**Como implementar:**
- Requer Bot Token (criar bot no Discord Developer Portal)
- Endpoint base: `https://discord.com/api/v10`
- Endpoints:
  - `/users/@me` - Info do bot
  - `/guilds/{guild_id}/members/{user_id}` - Info de membro
  - `/users/{user_id}` - Info de usuário

**Seções sugeridas:**
- Server Stats (via bot)
- Activity (limitado)
- User Info

**Configurações essenciais:**
- `PLUGIN_DISCORD_BOT_TOKEN` (password)
- `PLUGIN_DISCORD_USER_ID` (text, opcional)

**Nota:** Limitado pois requer bot. Melhor para dados de servidores que o bot gerencia.

---

## Resumo de Priorização

### Primeira Onda (Muito Fáceis - 5 plugins)
1. Spotify ⭐⭐⭐⭐⭐
2. AniList ⭐⭐⭐⭐⭐
3. Reddit ⭐⭐⭐⭐⭐
4. Dev.to ⭐⭐⭐⭐⭐
5. Codewars ⭐⭐⭐⭐⭐

### Segunda Onda (Fáceis - 5 plugins)
6. WakaTime ⭐⭐⭐⭐
7. Codeforces ⭐⭐⭐⭐
8. Stack Overflow ⭐⭐⭐⭐
9. LeetCode ⭐⭐⭐⭐
10. Twitter/X ⭐⭐⭐⭐

### Terceira Onda (Médios - 5 plugins)
11. HackerRank ⭐⭐⭐
12. Duolingo ⭐⭐⭐
13. Letterboxd ⭐⭐⭐
14. Goodreads ⭐⭐⭐
15. Discord ⭐⭐⭐

---

## Notas de Implementação

### Padrão de Plugin
Todos os plugins devem seguir a estrutura padrão em `weeb-plugins/src/plugins/_template/`:

1. Criar pasta `weeb-plugins/src/plugins/{plugin-name}/`
2. Implementar:
   - `index.tsx` - Plugin definition
   - `types.ts` - TypeScript types
   - `components/` - React components
   - `services/fetch{Plugin}.ts` - Data fetching
   - `ENV_VARIABLES.ts` - Environment variables
   - `examples.yml` - Configuration examples
   - `README.md` - Documentation

3. Registrar no `PluginManager` e `metadata.ts`

### Autenticação OAuth
Para plugins que requerem OAuth (Spotify, Twitter):
- Implementar flow de OAuth no dashboard
- Armazenar tokens de forma segura (encrypted)
- Implementar refresh token quando necessário

### Scraping
Para plugins que requerem scraping (Goodreads, Letterboxd, HackerRank):
- Usar bibliotecas como `cheerio` ou `puppeteer`
- Implementar cache para evitar rate limiting
- Tratar mudanças na estrutura do site
- Considerar usar APIs não oficiais quando disponíveis

### Rate Limiting
- Implementar cache adequado
- Respeitar rate limits das APIs
- Usar retry logic com exponential backoff

