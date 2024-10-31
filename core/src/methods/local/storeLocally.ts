import path from "path"
import { writeFile } from "fs/promises"
import { homedir } from "os"
import logger from "core/utils/logger"

async function storeLocally(data: string, filename: string) {
  try {
    const desktopPath = path.join(homedir(), "Desktop")
    const filePath = path.join(desktopPath, filename)
    await writeFile(filePath, data, "utf8")
    logger({ message: `File saved successfully to ${filePath}`, level: "success", path: ["MAIN", "STORE LOCALLY"] })
  } catch (err) {
    const error = err as Error
    logger({ message: "Error saving file", level: "error", path: ["MAIN", "STORE LOCALLY"], error })
  }
}

export default storeLocally
