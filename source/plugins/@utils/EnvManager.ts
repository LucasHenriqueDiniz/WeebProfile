import logger from "source/helpers/logger"
import { PluginsConfig } from "../@types/plugins"
import getEnvVariables from "./getEnvVariables"

export class EnvironmentManager {
  private static instance: EnvironmentManager
  private env: PluginsConfig

  private constructor() {
    logger({ message: "Loading environment variables...", level: "info", __filename })
    this.env = getEnvVariables()
  }

  public static getInstance(): EnvironmentManager {
    if (!EnvironmentManager.instance) {
      EnvironmentManager.instance = new EnvironmentManager()
    }
    return EnvironmentManager.instance
  }

  public getEnv(): PluginsConfig {
    if (!this.env) {
      logger({
        message: "Environment variables not found, loading from .env file",
        level: "error",
        __filename: "source/plugins/@utils/EnvManager.ts",
      })
      this.env = getEnvVariables()
    }

    return this.env
  }
}
