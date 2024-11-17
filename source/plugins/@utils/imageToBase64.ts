"use client"
import logger from "source/helpers/logger"
import isNodeEnvironment from "./isNodeEnv"

async function getImage64(imageUrl: string | undefined): Promise<string> {
  if (!imageUrl) {
    logger({
      message: `No image URL provided for ${imageUrl}`,
      level: "debug",
      __filename,
    })
    return "https://placecats.com/300/200"
  }

  // Always return the URL during SSR or in browser
  if (!isNodeEnvironment()) {
    logger({
      message: `Returning image URL during SSR or in browser`,
      level: "debug",
      __filename,
    })
    return imageUrl
  }

  try {
    // Only try to convert to base64 in Node.js environment
    const imageToBase64 = require("image-to-base64")
    return await imageToBase64(imageUrl)
  } catch (error) {
    logger({
      message: `Error converting image to base64: ${error}`,
      level: "error",
      __filename,
    })
    return "https://placecats.com/300/200"
  }
}

export default getImage64
