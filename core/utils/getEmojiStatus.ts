import getEnvVariables from "source/plugins/@utils/getEnvVariables"

export default function getEmojiStatus(status: string) {
  const { pluginMal } = getEnvVariables()
  const hideTerminalEmojis = pluginMal?.hide_terminal_emojis
  if (hideTerminalEmojis) return ""

  while (status.includes(" ")) {
    status = status.replace(" ", "_")
  }

  while (status.includes("-")) {
    status = status.replace("-", "_")
  }

  switch (status.toLowerCase().trim()) {
    case "completed":
      return "☑️"
    case "watching":
      return "📺"
    case "reading":
      return "📖"
    case "dropped":
      return "❌"
    case "on_hold":
      return "⏸️"
    case "plan_to_watch":
      return "📅"
    case "plan_to_read":
      return "📅"
    case "mean_score":
      return "📈"
    case "total_days":
      return "🕒"
    case "days_wasted":
      return "🕒"
    case "total_entries":
      return "📊"
    case "rewatched":
      return "🔁"
    case "reread":
      return "🔁"
    case "episodes_watched":
      return "📺"
    case "chapters_read":
      return "📖"
    case "volumes_read":
      return "📚"
    default:
      return "▶️"
  }
}
