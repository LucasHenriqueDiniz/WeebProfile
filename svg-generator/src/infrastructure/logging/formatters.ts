interface LogConfig {
  plugins?: Record<string, { enabled?: boolean }>
  style?: string
  size?: string
  userId?: string
}

interface TimingInfo {
  operation: string
  duration: number
  timestamp: string
}

export class RequestFormatter {
  static format(
    config: LogConfig
  ): Omit<LogConfig & { hasUserId: boolean; pluginCount: number }, "plugins"> & { plugins: string[] } {
    return {
      plugins: Object.keys(config.plugins || {}).filter((k) => (config.plugins || {})[k]?.enabled),
      style: config.style,
      size: config.size,
      hasUserId: !!config.userId,
      pluginCount: Object.keys(config.plugins || {}).length,
    }
  }

  static formatTiming(start: number, operation: string): TimingInfo {
    return {
      operation,
      duration: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  }
}
