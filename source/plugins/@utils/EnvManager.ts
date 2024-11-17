import logger from "source/helpers/logger"
import { PluginsConfig } from "../@types/plugins"
import getEnvVariables from "./getEnvVariables"

// type EnvSubscriber = (version: number) => void

export class EnvironmentManager {
  private static instance: EnvironmentManager
  private env: PluginsConfig
  // private subscribers: Set<EnvSubscriber> = new Set()
  // private version: number = 0

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
        __filename,
      })
      this.env = getEnvVariables()
    }
    return this.env
  }

  public refreshEnv(): void {
    this.env = getEnvVariables()
    logger({
      message: `Environment refreshed.`,
      level: "debug",
      __filename,
    })
  }

  public hardSetEnv(env: PluginsConfig): void {
    this.env = env
  }

  //@TODO maybe use a version number to track changes would be better? for now i will leave commented out because is not working as expected
  // public getCurrentVersion(): number {
  //   return this.version
  // }

  // public subscribe(callback: EnvSubscriber): () => void {
  //   this.subscribers.add(callback)
  //   return () => this.subscribers.delete(callback)
  // }

  // private notifySubscribers(): void {
  //   this.subscribers.forEach((callback) => callback(this.version))
  // }
}
