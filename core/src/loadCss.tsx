import fs from "fs"
import path from "path"
import React from "react"
import logger from "source/helpers/logger"
import { PluginsConfig } from "source/plugins/@types/plugins"

export async function LoadCss(Env: PluginsConfig) {
  logger({ message: "Loading CSS", level: "info", __filename })
  const customCss = Env.customCss as string | undefined

  const tailwindCss = fs.readFileSync(path.resolve(__dirname, "../../source/styles/generated-tailwind.css"), "utf8")
  const fontsFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/fonts.css"), "utf8")

  const globalCssFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/globals.css"), "utf8")
  const globalCompressedCss = globalCssFile.replace(/\s{2,10}/g, " ").replace(/(\r\n|\n|\r)/gm, "")

  return (
    <>
      <style>{fontsFile}</style>
      <style>{tailwindCss}</style>
      <style>{globalCompressedCss}</style>
      {customCss && <style>{customCss}</style>}
    </>
  )
}

export default LoadCss
