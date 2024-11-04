import path from "path"
import { writeFile } from "fs/promises"
import { homedir } from "os"
import logger from "source/helpers/logger"

async function storeLocally(data: string, filename: string) {
  try {
    const desktopPath = path.join(homedir(), "Desktop")
    const filePath = path.join(desktopPath, filename)
    await writeFile(filePath, data, "utf8")
    logger({ message: `File saved successfully to ${filePath}`, level: "success", __filename })
  } catch (err) {
    const error = err as Error
    logger({ message: "Error saving file", level: "error", __filename, error })
  }
}

export default storeLocally
