import React from "react"
import { PluginsConfig } from "source/plugins/@types/plugins"
import fs from "fs"
import path from "path"
import logger from "source/helpers/logger"

export async function LoadCss(Env: PluginsConfig) {
  logger({ message: "Loading CSS", level: "info", __filename })
  const isHalf = Env.size === "half"
  const customCss = Env.customCss as string | undefined
  const style = Env.style
  let css: string

  const tailwindCss = fs.readFileSync(path.resolve(__dirname, "../../source/styles/generated-tailwind.css"), "utf8")

  const fontsFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/fonts.css"), "utf8")

  const halfCssFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/half.css"), "utf8")
  const halfCompressedCss = halfCssFile.replace(/\s{2,10}/g, " ").replace(/(\r\n|\n|\r)/gm, "")
  const mainCssFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/main.css"), "utf8")
  const mainCompressedCss = mainCssFile.replace(/\s{2,10}/g, " ").replace(/(\r\n|\n|\r)/gm, "")

  let terminalCss: string
  let cssFile: string

  switch (style) {
    case "terminal":
      terminalCss = fs.readFileSync(path.resolve(__dirname, "../../source/styles/terminal.css"), "utf8")
      css = terminalCss.replace(/\s{2,10}/g, " ").replace(/(\r\n|\n|\r)/gm, "")
      break
    default:
      cssFile = fs.readFileSync(path.resolve(__dirname, "../../source/styles/default.css"), "utf8")
      css = cssFile.replace(/\s{2,10}/g, " ").replace(/(\r\n|\n|\r)/gm, "")
      break
  }
  return (
    <>
      <style>{tailwindCss}</style>
      {isHalf ? <style>{halfCompressedCss}</style> : null}
      <style>{fontsFile}</style>
      <style>{css}</style>
      {customCss && <style>{customCss}</style>}
      <style>{mainCompressedCss}</style>
    </>
  )
}

export default LoadCss
