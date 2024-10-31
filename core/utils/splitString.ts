import logger from "./logger"

function splitString(envString: string | undefined | string[]): string[] {
  // string example "PLUGIN_SECTIONS: anime, manga" => { PLUGIN_SECTIONS: ["anime", "manga"] }
  if (!envString) {
    logger({ message: "Empty string, envString: " + envString, level: "warn", __filename: __filename })
    return []
  }
  if (Array.isArray(envString)) {
    return envString
  }
  try {
    return envString.split(",").map((s) => s.trim())
  } catch (e) {
    throw new Error("Failed to split string, envString: " + envString + ", error: " + e)
  }
}

export default splitString
