import getEnvVariables from "source/plugins/@utils/getEnvVariables"

function emojiStatus(status: string) {
  const { hide_terminal_emojis } = getEnvVariables()
  if (hide_terminal_emojis) return ""

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

function emojiNumber(number: number) {
  switch (number) {
    case 1:
      return "1️⃣"
    case 2:
      return "2️⃣"
    case 3:
      return "3️⃣"
    case 4:
      return "4️⃣"
    case 5:
      return "5️⃣"
    case 6:
      return "6️⃣"
    case 7:
      return "7️⃣"
    case 8:
      return "8️⃣"
    case 9:
      return "9️⃣"
    case 10:
      return "🔟"
    default:
      return "▶️"
  }
}

export { emojiStatus, emojiNumber }
