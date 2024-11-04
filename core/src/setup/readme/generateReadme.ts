import fs from "fs"
import path from "path"
import mustache from "mustache"
import PluginVariables from "source/plugins/@types/PluginVariables"
import logger from "source/helpers/logger"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import { Plugin, PluginName } from "source/plugins/@types/plugins"

const rootDir = path.resolve(__dirname, "..", "..", "..", "..")
const pluginsRoot = path.join(rootDir, "source/plugins")
const pluginManager = PluginManager.getInstance()

type SummaryOption = { label: string; value: string }

interface ReadmeSection {
  section: string
  imagePath: string
}

interface ReadmePluginTemplate {
  mainTitle: string
  summaryOptions: SummaryOption[]
  envVariables: Record<string, PluginVariables>
  plugin_sections: {
    name: string
    sections_length: number
    defaultSections: ReadmeSection[]
    terminalSections: ReadmeSection[]
  }
}

interface ReadmeMainTemplate {
  summaryOptions: SummaryOption[]
  availablePlugins: SummaryOption[]
  supported_sections: {
    supported_total: number
    plugin_sections: {
      name: string
      defaultSections: ReadmeSection[]
      terminalSections: ReadmeSection[]
    }[]
  }
}

function getSections<TName extends PluginName>(plugin: Plugin<TName>, type = "default"): ReadmeSection[] {
  const sections: ReadmeSection[] = []

  if (type !== "default" && type !== "terminal") {
    logger({ message: `Invalid type: ${type}`, level: "error" })
    return sections
  }

  plugin.sections.map((section: string) => {
    const imagePath = path.join(rootDir, "source/plugins/", plugin.name, `assets/${type}`, `${section}.svg`)
    const imageExists = fs.existsSync(imagePath)
    const relativeImagePath = path.relative(rootDir, imagePath)

    if (imageExists === false) {
      logger({ message: `${plugin.name} | ${type} | Image not found: ${imagePath}`, level: "warn" })
    }

    sections.push({
      section,
      imagePath: imageExists ? relativeImagePath : "Image not found",
    })
  })

  return sections
}

function generateMainReadmeContent() {
  logger({ message: "Generating main readme", level: "info" })
  const templatePath = path.join(__dirname, "./templates/readme.md")
  const template = fs.readFileSync(templatePath, "utf8")

  const allPlugins = pluginManager.getAllPlugins()
  const pluginsSectionsLength = allPlugins.map((plugin) => plugin.sections.length).reduce((a, b) => a + b, 0)

  const GettingStartedContent = fs.readFileSync(path.join(__dirname, "./templates/setup.md"), "utf8")
  const LicenseContent = fs.readFileSync(path.join(__dirname, "./templates/license.md"), "utf8")
  const ContributingContent = fs.readFileSync(path.join(__dirname, "./templates/contributing.md"), "utf8")
  const SummaryArray = ["Available plugins", "Supported sections", "Setup", "Contributing", "License"]

  const data: ReadmeMainTemplate = {
    summaryOptions: SummaryArray.map((label) => ({ label, value: label.toLowerCase().replace(" ", "-") })),
    availablePlugins: allPlugins.map((plugin) => ({
      label: plugin.name,
      value: plugin.name.toLowerCase().replace(" ", "-"),
    })),
    supported_sections: {
      supported_total: pluginsSectionsLength,
      plugin_sections: allPlugins.map((plugin) => ({
        name: plugin.name,
        defaultSections: getSections(plugin, "default"),
        terminalSections: getSections(plugin, "terminal"),
      })),
    },
  }

  let body = mustache.render(template, data)

  // Add the rest of the content outside the mustache for now because it's not dynamic and mustache convert some characters
  body += GettingStartedContent
  body += ContributingContent
  body += LicenseContent
  return body
}

function generatePluginReadmeContent<TName extends PluginName>(plugin: Plugin<TName>) {
  const templatePath = path.join(__dirname, "./templates/plugin.md")
  const template = fs.readFileSync(templatePath, "utf8")
  const SummaryArray = ["Supported sections", "Setup", "Contributing", "License"]

  const data: ReadmePluginTemplate = {
    mainTitle: plugin.name,
    summaryOptions: SummaryArray.map((label) => ({ label, value: label.toLowerCase().replace(" ", "-") })),
    envVariables: plugin.envVariables,
    plugin_sections: {
      name: plugin.name,
      sections_length: plugin.sections.length,
      defaultSections: getSections(plugin, "default"),
      terminalSections: getSections(plugin, "terminal"),
    },
  }

  return mustache.render(template, data)
}

function saveReadme(content: string, root = rootDir) {
  try {
    if (fs.existsSync(path.join(root, "README.md"))) {
      logger({ message: `Overwriting readme file in ${root}`, level: "info" })
    } else {
      logger({ message: `Creating readme file in ${root}`, level: "info" })
    }

    fs.writeFileSync(path.join(root, "README.md"), content)
  } catch (err) {
    logger({ message: `Error: ${err}`, level: "error" })
  }
}

logger({ message: "Generating readme files", level: "info", header: true })
const readmeContent = generateMainReadmeContent()
saveReadme(readmeContent)

// Generate readme for each plugin
pluginManager.getAllPlugins().forEach((plugin) => {
  logger({ message: `Generating readme for ${plugin.name}`, level: "info" })
  const pluginReadmeContent = generatePluginReadmeContent(plugin)
  saveReadme(pluginReadmeContent, path.join(pluginsRoot, plugin.name))
})
