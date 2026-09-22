import { LogLevel } from "../../infrastructure/logging/Logger"
import {
  AppConfig,
  CacheConfig,
  DatabaseConfig,
  LoggingConfig,
  PlaywrightConfig,
  SecurityConfig,
  ServerConfig,
} from "./types"

export class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  private constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  private loadConfig(): AppConfig {
    return {
      server: this.loadServerConfig(),
      database: this.loadDatabaseConfig(),
      playwright: this.loadPlaywrightConfig(),
      logging: this.loadLoggingConfig(),
      cache: this.loadCacheConfig(),
      security: this.loadSecurityConfig(),
    }
  }

  private loadServerConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || process.env.SVG_GENERATOR_PORT || "3001"),
      cors: {
        origin: (process.env.CORS_ORIGIN || "*").split(","),
        methods: ["POST", "OPTIONS"],
        headers: ["Content-Type", "Authorization"],
      },
      timeouts: {
        request: parseInt(process.env.REQUEST_TIMEOUT || "30000"),
        generation: parseInt(process.env.GENERATION_TIMEOUT || "10000"),
        cron: parseInt(process.env.CRON_TIMEOUT || "360000"),
      },
    }
  }

  private loadDatabaseConfig(): DatabaseConfig {
    const url = process.env.DATABASE_URL

    // Se não tiver DATABASE_URL, retorna config padrão para desenvolvimento
    if (!url) {
      return {
        url: "sqlite::memory:",
        poolSize: 1,
        timeout: 5000,
        ssl: false,
      }
    }

    return {
      url,
      poolSize: parseInt(process.env.DB_POOL_SIZE || "5"),
      timeout: parseInt(process.env.DB_TIMEOUT || "5000"),
      ssl: url.includes("supabase"),
    }
  }

  private loadPlaywrightConfig(): PlaywrightConfig {
    return {
      timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT_MS || "2500"),
      poolSize: parseInt(process.env.BROWSER_POOL_SIZE || "3"),
      retries: parseInt(process.env.PLAYWRIGHT_RETRIES || "2"),
      allowNetwork: process.env.ALLOW_NETWORK === "1",
    }
  }

  private loadLoggingConfig(): LoggingConfig {
    return {
      level: (process.env.LOG_LEVEL || "info") as LogLevel,
      format: (process.env.LOG_FORMAT as "json" | "text") || "json",
      enableConsole: process.env.LOG_CONSOLE !== "false",
      enableFile: process.env.LOG_FILE === "true",
      filePath: process.env.LOG_FILE_PATH || "./logs/app.log",
    }
  }

  private loadCacheConfig(): CacheConfig {
    return {
      enabled: process.env.CACHE_ENABLED === "true",
      ttl: parseInt(process.env.CACHE_TTL || "3600"),
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || "1000"),
    }
  }

  private loadSecurityConfig(): SecurityConfig {
    return {
      cronSecret: process.env.CRON_SECRET || "",
      jwtSecret: process.env.JWT_SECRET || "",
      rateLimit: {
        enabled: process.env.RATE_LIMIT_ENABLED !== "false",
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || "900000"),
        max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
      },
    }
  }

  private validateConfig(): void {
    // DATABASE_URL é opcional para desenvolvimento/debug
    const required: string[] = []

    // Apenas validar em produção
    if (process.env.NODE_ENV === "production") {
      required.push("DATABASE_URL")
    }

    const missing = required.filter((key) => !process.env[key])

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
    }

    if (this.config.security.cronSecret === "") {
      // eslint-disable-next-line no-console
      console.warn("⚠️ CRON_SECRET not configured - cron endpoints will be disabled")
    }
  }

  getConfig(): AppConfig {
    return this.config
  }

  getServerConfig(): ServerConfig {
    return this.config.server
  }

  getDatabaseConfig(): DatabaseConfig {
    return this.config.database
  }

  getPlaywrightConfig(): PlaywrightConfig {
    return this.config.playwright
  }

  getLoggingConfig(): LoggingConfig {
    return this.config.logging
  }

  getCacheConfig(): CacheConfig {
    return this.config.cache
  }

  getSecurityConfig(): SecurityConfig {
    return this.config.security
  }
}
