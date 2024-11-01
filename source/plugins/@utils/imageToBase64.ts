import isNodeEnvironment from "./isNodeEnv"

async function getImage64(imageUrl: string | undefined): Promise<string> {
  if (!imageUrl) {
    return "https://placecats.com/300/200"
  }
  const isNodeEnv = isNodeEnvironment()
  if (isNodeEnv) {
    try {
      // This need to be a conditional import because if not it tries to import the image-to-base64 and it's not available in the browser
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const imageToBase64 = require("image-to-base64")
      return await imageToBase64(imageUrl)
    } catch (error) {
      console.error("Error converting image to base64:", error)
      return "https://placecats.com/300/200"
    }
  } else {
    // If in a browser environment, skip conversion and return the original URL
    console.log("Not in Node.js environment, skipping image conversion")
    return imageUrl
  }
}

export default getImage64
