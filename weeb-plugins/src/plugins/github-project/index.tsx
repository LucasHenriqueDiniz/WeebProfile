import { Plugin } from "../shared/types/plugin"
import { RenderGitHubProject } from "./components/RenderGitHubProject"
import { fetchGitHubProjectData } from "./services/fetchData"
import { getMockData } from "./services/mock-data"
import { GitHubProjectConfig, GitHubProjectData } from "./types"

// CSS otimizado - apenas classes essenciais (sem variáveis de cor!)
const cssStyles = `
/* Classes essenciais usadas */
#svg-main .rounded-xl {
  border-radius: 0.75rem;
}
#svg-main .p-6 {
  padding: 1.5rem;
}
#svg-main .w-24 {
  width: 6rem;
}
#svg-main .h-24 {
  height: 6rem;
}
#svg-main .w-8 {
  width: 2rem;
}
#svg-main .h-8 {
  height: 2rem;
}
#svg-main .w-4 {
  width: 1rem;
}
#svg-main .h-4 {
  height: 1rem;
}
#svg-main .flex { display: flex; }
#svg-main .flex-col { flex-direction: column; }
#svg-main .items-center { align-items: center; }
#svg-main .justify-center { justify-content: center; }
#svg-main .gap-2 { gap: 0.5rem; }
#svg-main .gap-6 { gap: 1.5rem; }
#svg-main .mb-2 { margin-bottom: 0.5rem; }
#svg-main .mb-3 { margin-bottom: 0.75rem; }
#svg-main .mb-4 { margin-bottom: 1rem; }
#svg-main .text-center { text-align: center; }
#svg-main .relative { position: relative; }
#svg-main .absolute { position: absolute; }
#svg-main .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
#svg-main .overflow-hidden { overflow: hidden; }
#svg-main .object-cover { object-fit: cover; }
#svg-main .rounded-full { border-radius: 50%; }
#svg-main .text-2xl { font-size: 1.5rem; line-height: 2rem; }
#svg-main .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
#svg-main .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
#svg-main .text-xs { font-size: 0.75rem; line-height: 1rem; }
#svg-main .font-bold { font-weight: 700; }
#svg-main .font-semibold { font-weight: 600; }
#svg-main .font-mono { font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace; }
#svg-main .leading-relaxed { line-height: 1.625; }
#svg-main .space-y-4 > * + * { margin-top: 1rem; }
#svg-main .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1); }
#svg-main .border { border-width: 1px; }
#svg-main .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2); }
#svg-main .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
#svg-main .ring-4 { box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2); }
#svg-main .-bottom-2 { bottom: -0.5rem; }
#svg-main .-right-2 { right: -0.5rem; }
#svg-main .from-blue-500 { --tw-gradient-from: #3b82f6; }
#svg-main .via-purple-500 { --tw-gradient-via: #a855f7; }
#svg-main .to-pink-500 { --tw-gradient-to: #ec4899; }
#svg-main .from-green-400 { --tw-gradient-from: #4ade80; }
#svg-main .to-green-600 { --tw-gradient-to: #16a34a; }
#svg-main .from-blue-400 { --tw-gradient-from: #60a5fa; }
#svg-main .to-blue-600 { --tw-gradient-to: #2563eb; }
#svg-main .from-yellow-400 { --tw-gradient-from: #facc15; }
#svg-main .to-yellow-600 { --tw-gradient-to: #ca8a04; }
#svg-main .from-gray-400 { --tw-gradient-from: #9ca3af; }
#svg-main .to-gray-600 { --tw-gradient-to: #4b5563; }
#svg-main .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to)); }
#svg-main .text-white { color: #ffffff; }
#svg-main .text-default-text { color: var(--default-color-text); }
#svg-main .text-default-muted { color: var(--default-color-muted); }
#svg-main .text-blue-400 { color: #60a5fa; }
#svg-main .border-blue-500\\/20 { border-color: rgba(59, 130, 246, 0.2); }
#svg-main .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
#svg-main .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
#svg-main .font-medium { font-weight: 500; }
#svg-main .flex-wrap { flex-wrap: wrap; }
#svg-main .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Component-specific styles */
#svg-main .github-card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--default-color-muted);
  transition: all 0.2s ease;
}

#svg-main .github-card.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

#svg-main .github-card.solid {
  background: var(--default-color-surface);
  border-color: var(--default-color-muted);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

#svg-main .github-card.outline {
  background: transparent;
  border-color: var(--default-color-muted);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.05);
}

/* Width variants */
#svg-main .github-card.half {
  width: 415px;
  max-width: 415px;
}

#svg-main .github-card.full {
  width: 830px;
  max-width: 830px;
}

/* Banner Styles - Enhanced */
#svg-main .github-banner-modern {
  position: relative;
  overflow: hidden;
}

#svg-main .github-banner-modern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
  pointer-events: none;
}

#svg-main .github-banner-modern .avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

#svg-main .github-banner-modern .avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

#svg-main .github-banner-modern .status-indicator {
  position: absolute;
  bottom: -0.5rem;
  right: -0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: 4px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .github-banner-modern .repo-info {
  text-align: center;
  margin-bottom: 1rem;
}

#svg-main .github-banner-modern .repo-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--default-color-text);
  margin-bottom: 0.5rem;
}

#svg-main .github-banner-modern .repo-fullname {
  font-size: 0.875rem;
  color: var(--default-color-muted);
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  margin-bottom: 0.75rem;
}

#svg-main .github-banner-modern .repo-description {
  font-size: 0.875rem;
  color: var(--default-color-text);
  line-height: 1.625;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Stats Container */
#svg-main .stats-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

#svg-main .stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

#svg-main .stat-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .stat-details {
  text-align: center;
}

#svg-main .stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--default-color-text);
  line-height: 1.75rem;
}

#svg-main .stat-label {
  font-size: 0.75rem;
  color: var(--default-color-muted);
  line-height: 1rem;
}

/* Languages Section */
#svg-main .languages-container {
  margin-top: 1rem;
}

#svg-main .languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
}

#svg-main .language-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--default-color-text);
}

#svg-main .language-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
}

#svg-main .language-name {
  font-size: 0.75rem;
  color: var(--default-color-muted);
}

/* Tags */
#svg-main .tags-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

#svg-main .tag {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

/* Background Patterns */
#svg-main .bg-pattern-dots {
  background-image: radial-gradient(circle, var(--default-color-highlight) 1px, transparent 1px);
  background-size: 40px 40px;
}

#svg-main .bg-pattern-lines {
  background-image: linear-gradient(var(--default-color-muted) 1px, transparent 1px),
                    linear-gradient(90deg, var(--default-color-muted) 1px, transparent 1px);
  background-size: 40px 40px, 60px 60px;
}

#svg-main .bg-pattern-grid {
  background-image: linear-gradient(45deg, var(--default-color-muted) 25%, transparent 25%),
                    linear-gradient(-45deg, var(--default-color-muted-light) 25%, transparent 25%);
  background-size: 60px 60px;
}

#svg-main .bg-pattern-radial {
  background-image: radial-gradient(circle, var(--default-color-highlight) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* Responsive Design */
@media (max-width: 768px) {
  #svg-main .github-card.half {
    width: 100%;
    max-width: 100%;
  }
  
  #svg-main .github-card.full {
    width: 100%;
    max-width: 100%;
  }
  
  #svg-main .stats-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  #svg-main .languages-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
}
`

export const githubProjectPlugin: Plugin<GitHubProjectConfig, GitHubProjectData> = {
  name: "github-project",
  essentialConfigKeys: [], // Token configurado no backend (.env)
  styles: cssStyles,

  config: {
    enabled: false,
    sections: [],
    repository: "",
    skin: "glass",
    sections_config: {
      banner: {
        enabled: true,
        style: "hero",
        background: "default",
        custom_avatar: "",
        hide_stars: false,
        hide_forks: false,
        hide_description: false,
        hide_watchers: true,
        show_contributors: false,
        contributors_limit: 5,
        terminal_font: "standard",
        custom_name: "",
        hide_ascii_box: false,
        hide_git_commands: false,
        hide_background: false,
        custom_width: 0,
      },
      stats: { enabled: true },
      languages: { enabled: true, top: 5 },
      contributors: { enabled: true, limit: 8 },
      starHistory: { enabled: false, chart_type: "line", show_grid: true, show_dots: false },
    },
  } as GitHubProjectConfig,

  async fetchData(config: GitHubProjectConfig, dev = false, _essentialConfig) {
    // Handle dev mode with mock data
    if (dev) {
      const mockData = getMockData(config)
      return {
        repository: mockData.repository,
        stats: mockData.stats,
        languages: mockData.languages,
        contributors: mockData.contributors,
        starHistory: mockData.starHistory,
        sections_config: config.sections_config || {},
      }
    }

    // Validate required config for production
    if (!config.repository) {
      throw new Error("Repository is required")
    }

    // Fetch real data (token is handled in environment)
    const data = await fetchGitHubProjectData(config)

    return data
  },

  render(config, data) {
    // Extrair style e size do config (vem do SvgConfig)
    const style = ((config as any).style || "default") as "default" | "terminal"
    const size = ((config as any).size || "half") as "half" | "full"
    return <RenderGitHubProject data={data} config={config} style={style} size={size} />
  },
}
