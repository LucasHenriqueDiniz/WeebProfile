/* eslint-disable no-console */
type LogLevel = "info" | "warn" | "error" | "path" | "message" | "reset" | "success" | "debug"
// Import dotenv to load environment variables
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Get the log level from environment variables
const envLogLevel = (process.env.LOG_LEVEL as LogLevel) || "info"

// Function to determine if a message should be logged based on the log level
function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ["debug", "info", "warn", "error"]
  const envLevelIndex = levels.indexOf(envLogLevel)
  const messageLevelIndex = levels.indexOf(level)
  return messageLevelIndex >= envLevelIndex
}

function logger({
  message,
  level = "info",
  __filename,
  header = false,
  error,
}: {
  message: string
  level?: LogLevel
  __filename?: string
  header?: boolean
  error?: Error
}) {
  if (!shouldLog(level)) {
    return
  }

  const color: { [key in LogLevel]: string } = {
    success: "\x1b[32m",
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    path: "\x1b[34m",
    message: "\x1b[90m",
    reset: "\x1b[0m",
    debug: "\x1b[35m",
  }

  const formattedPath = __filename ? `${color.path}[${__filename}]${color.reset} ` : ""
  const formattedLevel = `${color[level]}[${level.toUpperCase()}]${color.reset}`
  const time = new Date().toLocaleTimeString()
  const formattedMessage =
    `${formattedPath}${formattedLevel} ${color.message}${time} | ${message}${color.reset}` + (error ? `\n${error}` : "")

  if (header) {
    const border = "=".repeat(formattedMessage.length + 4)
    console.log(`\n${color[level]}${border}\n| ${formattedMessage} |\n${border}\n${color.reset}`)
  } else {
    console.log(formattedMessage)
  }
}

export default logger
