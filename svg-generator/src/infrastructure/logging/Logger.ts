export interface LogEntry {
  level: LogLevel
  context: string
  message: string
  timestamp: string
  meta?: any
  error?: string
}

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export class Logger {
  private context: string
  private minLevel: LogLevel

  constructor(context: string, minLevel: LogLevel = LogLevel.INFO) {
    this.context = context
    this.minLevel = minLevel
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private log(level: LogLevel, message: string, meta?: any, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      context: this.context,
      message,
      timestamp: new Date().toISOString(),
      meta,
      error: error?.stack,
    }

    // Output formatado para fácil parsing
    console.log(JSON.stringify(entry))
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta)
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta)
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta)
  }

  error(message: string, error?: Error, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta, error)
  }
}
