import fillEmptySpaces from "../../../utils/fillEmptySpaces"
import getEmojiNumber from "../../../utils/getEmojiNumber"
import getEmojiStatus from "../../../utils/getEmojiStatus"

function getPercentageBar(watched: number, total: number, title: string) {
  const percentage = Math.floor((watched / total) * 100)
  const filledBlocks = Math.floor(percentage / 5)
  let bar = "█".repeat(filledBlocks)

  if (title.length > 25) {
    title = title.slice(0, 25) + "..."
  }

  // Se a porcentagem não é múltipla de 10, adiciona um bloco preenchido pela metade
  if (percentage % 5 > 0) {
    bar += "▓"
  }

  bar += "░".repeat(20 - bar.length) // Completa com blocos vazios

  return `${title} ${fillEmptySpaces(title, 23, ".")} ${bar} ${percentage}%`
}

function formatDisplay(
  title: string,
  displayType: string,
  watched: number,
  total: number,
  score: number,
  status: string
) {
  switch (displayType) {
    case "images":
      // Not supported in Gists
      throw new Error("Display type 'images' not supported in Gists.")
    case "bar":
      // Bakemonogatari ....................... █████████████████████ 100%
      return getPercentageBar(watched, total, title)
    case "number":
      // Bakemonogatari ............................................ 12/15
      return `${title} ${fillEmptySpaces(title, watched.toString().length + total.toString().length + 1, ".")} ${watched}/${total}`
    case "none":
      // Bakemonogatari
      return `${title}`
    case "status-emoji":
      // Bakemonogatari ............................................ ☑️
      return `${title} ${fillEmptySpaces(title, 1, ".")}} ${getEmojiStatus(status)}`
    case "status-text":
      // Bakemonogatari ...................................... Watching
      return `${title} ${fillEmptySpaces(title, status.length, ".")}} ${status}`
    case "score-emoji":
      // Bakemonogatari ............................................ 9️⃣
      return `${title} ${fillEmptySpaces(title, 1, ".")} ${getEmojiNumber(score)}`
    case "score-text":
      // Bakemonogatari ............................................ 9/10
      return `${title} ${fillEmptySpaces(title, 5, ".")} ${score === 0 ? "~" : score}/10`
    default:
      // Bakemonogatari
      return `${title}`
  }
}

export default formatDisplay
