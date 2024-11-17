interface LanguageInfo {
  name: string
  color: string
}

const extensionToLanguage: Record<string, LanguageInfo> = {
  // Web
  js: { name: "JavaScript", color: "#f1e05a" },
  jsx: { name: "JavaScript", color: "#f1e05a" },
  ts: { name: "TypeScript", color: "#3178c6" },
  tsx: { name: "TypeScript", color: "#3178c6" },
  html: { name: "HTML", color: "#e34c26" },
  css: { name: "CSS", color: "#563d7c" },
  scss: { name: "SCSS", color: "#c6538c" },
  sass: { name: "Sass", color: "#a53b70" },
  vue: { name: "Vue", color: "#41b882" },
  svelte: { name: "Svelte", color: "#ff3e00" },

  // Backend
  py: { name: "Python", color: "#3572A5" },
  rb: { name: "Ruby", color: "#701516" },
  php: { name: "PHP", color: "#4F5D95" },
  java: { name: "Java", color: "#b07219" },
  kt: { name: "Kotlin", color: "#A97BFF" },
  cs: { name: "C#", color: "#178600" },
  go: { name: "Go", color: "#00ADD8" },
  rs: { name: "Rust", color: "#dea584" },

  // Data/Config
  json: { name: "JSON", color: "#292929" },
  yaml: { name: "YAML", color: "#cb171e" },
  yml: { name: "YAML", color: "#cb171e" },
  xml: { name: "XML", color: "#0060ac" },
  toml: { name: "TOML", color: "#9c4221" },

  // Documentation
  md: { name: "Markdown", color: "#083fa1" },
  mdx: { name: "MDX", color: "#1B1F24" },

  // Shell
  sh: { name: "Shell", color: "#89e051" },
  bash: { name: "Shell", color: "#89e051" },
  zsh: { name: "Shell", color: "#89e051" },
  ps1: { name: "PowerShell", color: "#659ad2" },
}

export function getLanguageFromExtension(filename: string): LanguageInfo {
  const extension = filename.split(".").pop()?.toLowerCase() || ""
  return extensionToLanguage[extension] || { name: extension, color: "#959da5" }
}
