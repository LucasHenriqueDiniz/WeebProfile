import fs from "fs"
import path from "path"
import mustache from "mustache"
import PluginVariables from "source/plugins/@types/PluginVariables"
import plugins, { PluginType } from "source/plugins/plugins"
import logger from "core/utils/logger"

const rootDir = path.resolve(__dirname, "..", "..", "..")
const pluginsRoot = path.join(rootDir, "source/plugins")

interface ReadmeSection {
  section: string
  imagePath: string
}

interface ReadmePluginTemplate {
  mainTitle: string
  summaryOptions: string[]
  envVariables: Record<string, PluginVariables>
  plugin_sections: {
    name: string
    sections_length: number
    defaultSections: ReadmeSection[]
    terminalSections: ReadmeSection[]
  }
}

interface ReadmeMainTemplate {
  summaryOptions: string[]
  availablePlugins: string[]
  supported_sections: {
    supported_total: number
    plugin_sections: {
      name: string
      defaultSections: ReadmeSection[]
      terminalSections: ReadmeSection[]
    }[]
  }
  gettingStarted: string
  license: string
  contributing: string
}

function getSections(plugin: PluginType, type = "default"): ReadmeSection[] {
  const sections: ReadmeSection[] = []

  if (type !== "default" && type !== "terminal") {
    logger({ message: `Invalid type: ${type}`, level: "error" })
    return sections
  }

  plugin.sections.map((section) => {
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
  const pluginsSectionsLength = plugins.map((plugin) => plugin.sections.length).reduce((a, b) => a + b, 0)

  const GettingStartedContent = fs.readFileSync(path.join(__dirname, "./templates/setup.md"), "utf8")
  const LicenseContent = fs.readFileSync(path.join(__dirname, "./templates/license.md"), "utf8")
  const ContributingContent = fs.readFileSync(path.join(__dirname, "./templates/contributing.md"), "utf8")

  const data: ReadmeMainTemplate = {
    summaryOptions: ["Available plugins", "Supported sections", "Setup", "Contributing", "License"],
    availablePlugins: plugins.map((plugin) => plugin.name),
    supported_sections: {
      supported_total: pluginsSectionsLength,
      plugin_sections: plugins.map((plugin) => ({
        name: plugin.name,
        defaultSections: getSections(plugin, "default"),
        terminalSections: getSections(plugin, "terminal"),
      })),
    },
    gettingStarted: GettingStartedContent,
    license: LicenseContent,
    contributing: ContributingContent,
  }

  return mustache.render(template, data)
}

function generatePluginReadmeContent(plugin: PluginType) {
  const templatePath = path.join(__dirname, "./templates/plugin.md")
  const template = fs.readFileSync(templatePath, "utf8")

  const data: ReadmePluginTemplate = {
    mainTitle: plugin.name,
    summaryOptions: ["Supported sections", "Setup", "Contributing", "License"],
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
    // create a readme file in the location of the plugin, if exists, overwrite it and log the action
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

plugins.forEach((plugin) => {
  logger({ message: `Generating readme for ${plugin.name}`, level: "info" })
  const pluginReadmeContent = generatePluginReadmeContent(plugin)
  saveReadme(pluginReadmeContent, path.join(pluginsRoot, plugin.name))
})
