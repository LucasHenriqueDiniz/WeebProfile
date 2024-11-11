import { exec } from "child_process"
import logger from "source/helpers/logger"

export async function buildTailwind() {
  logger({ message: "Building Tailwind CSS with PostCSS...", level: "info", __filename })

  return new Promise((resolve, reject) => {
    exec("npm run build:css", { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        logger({ message: `Tailwind build error: ${error}`, level: "error", __filename })
        reject(error)
        return
      }
      if (stderr) {
        logger({ message: `Tailwind build warning: ${stderr}`, level: "warn", __filename })
      }
      logger({ message: "Tailwind CSS built successfully", level: "success", __filename })
      resolve(stdout)
    })
  })
}
