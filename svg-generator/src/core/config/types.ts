import { LogLevel } from "../../infrastructure/logging/Logger"

export interface LoggingConfig {
  level: LogLevel
  format: "json" | "text"
  enableConsole: boolean
  enableFile: boolean
  filePath: string
}

export interface CacheConfig {
  enabled: boolean
  ttl: number
  maxSize: number
}

export interface SecurityConfig {
  cronSecret: string
  jwtSecret: string
  rateLimit: {
    enabled: boolean
    windowMs: number
    max: number
  }
}

export interface ServerConfig {
  port: number
  cors: {
    origin: string[]
    methods: string[]
    headers: string[]
  }
  timeouts: {
    request: number
    generation: number
    cron: number
  }
}

export interface DatabaseConfig {
  url: string
  poolSize: number
  timeout: number
  ssl: boolean
}

export interface PlaywrightConfig {
  timeout: number
  poolSize: number
  retries: number
  allowNetwork: boolean
}

export interface AppConfig {
  server: ServerConfig
  database: DatabaseConfig
  playwright: PlaywrightConfig
  logging: LoggingConfig
  cache: CacheConfig
  security: SecurityConfig
}
