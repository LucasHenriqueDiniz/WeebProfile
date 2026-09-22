import { Logger, LogLevel } from "./Logger"

export class LoggerFactory {
  private static loggers = new Map<string, Logger>()
  private static globalLevel: LogLevel = LogLevel.INFO

  static setGlobalLevel(level: LogLevel): void {
    this.globalLevel = level
    // Atualizar loggers existentes
    this.loggers.forEach((logger) => {
      logger["minLevel"] = level
    })
  }

  static getLogger(context: string): Logger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, new Logger(context, this.globalLevel))
    }
    return this.loggers.get(context)!
  }
}

// Uso simplificado
export const logger = LoggerFactory.getLogger("SvgGenerator")
