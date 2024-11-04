import fs from "fs"
import path from "path"
import asyncReplace from "../../utils/AsyncReplace"
import imageToBase64 from "image-to-base64"
import logger from "source/helpers/logger"

const rootDir = path.resolve(__dirname, "..", "..", "..", "..")

//
// This script is used to convert all the fonts in the raw_fonts.css to base64 and save it in the fonts.css
// This need to be used every time you change the raw_fonts.css (yarn run setup-fonts)
//

async function setupFonts() {
  //check if raw_fonts.css exists
  if (!fs.existsSync(path.resolve(rootDir, "source/styles/raw_fonts.css"))) {
    throw new Error("raw_fonts.css not found")
  }

  //check if fonts.css exists
  if (!fs.existsSync(path.resolve(rootDir, "source/styles/fonts.css"))) {
    logger({ message: "fonts.css not found, creating it...", level: "info", __filename })
    fs.mkdirSync(path.resolve(rootDir, "source/styles"), { recursive: true })
  }

  //create fonts.css using raw_fonts.css and converting all the url() to base64 using image-to-base64
  const rawFonts = fs.readFileSync(path.resolve(rootDir, "source/styles/raw_fonts.css"), "utf8")
  const fonts = await asyncReplace(rawFonts, /url\((.*?)\)/g, async (match) => {
    const urlMatch = match.match(/url\((.*?)\)/)
    if (!urlMatch) {
      throw new Error("URL match not found")
    }
    const url = urlMatch[1]?.replace(/['"]+/g, "") || ""
    const base64 = await imageToBase64(url)
    return `url("data:image/png;base64,${base64}")`
  })

  fs.writeFileSync(path.resolve(rootDir, "source/styles/fonts.css"), fonts)
  logger({ message: "fonts.css created with success!", level: "success", __filename })
}

setupFonts()
