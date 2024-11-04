import { execSync } from "child_process"
import logger from "source/helpers/logger"
import fs from "fs"
import path from "path"
import { Plugin, PluginName } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"

const rootDir = path.resolve(__dirname, "..", "..", "..", "..")
const divider = "# ====================================================================================\n"
const pluginManager = PluginManager.getInstance()

logger({ message: "Generating action", level: "info", header: true })
const inputs = generateInputs()
const metadata = generateActionMetadata()
saveActionMetadata(inputs + metadata)

// run prettier on the generated action.yml file
logger({ message: "Running prettier on action.yml", level: "info" })
execSync("npx prettier --write action.yml", { stdio: "inherit" })

function generatePluginInputs<TName extends PluginName>(plugin: Plugin<TName>): string {
  let inputs = divider
  const pluginKey = `PLUGIN_${plugin.name.toUpperCase()}`

  inputs += `  # ${plugin.name} Plugin\n`
  inputs += `  ${pluginKey}:\n`
  inputs += `    description: "Enable ${plugin.name} Plugin"\n`
  inputs += '    default: "false"\n'
  inputs += "    required: false\n"

  Object.entries(plugin.envVariables).forEach(([variableKey, variable]) => {
    if (variableKey === "plugin_enabled") return
    inputs += `  ${pluginKey}_${variableKey.toUpperCase()}:\n`
    inputs += `    description: "${variable.description}${variable.required ? " | Needed for plugin to work" : ""}"\n`
    inputs += "    required: false\n"
    if (variable.defaultValue) {
      inputs += `    default: "${variable.defaultValue}"\n`
    }
  })

  return inputs
}

function generateInputs(): string {
  logger({ message: "Generating inputs", level: "info" })
  let inputs = "inputs:\n"

  // Generate main env variables inputs
  Object.entries(MAIN_ENV_VARIABLES).forEach(([key, variable]) => {
    inputs += `  ${key.toUpperCase()}:\n`
    inputs += `    description: "${variable.description}"\n`
    inputs += `    required: ${variable.required ?? false}\n`
    if (variable.defaultValue) {
      inputs += `    default: "${variable.defaultValue}"\n`
    }
  })

  // Generate plugin inputs
  pluginManager.getAllPlugins().forEach((plugin) => {
    inputs += generatePluginInputs(plugin)
  })

  inputs += divider
  return inputs
}

function getTemplate(template: string): string {
  const templatePath = path.join(__dirname, `templates/${template}.yml`)
  if (!fs.existsSync(templatePath)) {
    logger({ message: `Template ${template} not found`, level: "error" })
    process.exit(1)
  }

  return fs.readFileSync(templatePath, "utf8")
}

function generatePluginMetadata<TName extends PluginName>(plugin: Plugin<TName>): string {
  let metadata = ""
  const pluginKey = `PLUGIN_${plugin.name.toUpperCase()}`

  metadata += `        ${pluginKey}: \${{ inputs.${pluginKey} }}\n`
  Object.entries(plugin.envVariables).forEach(([variableKey]) => {
    metadata += `        ${pluginKey}_${variableKey.toUpperCase()}: \${{ inputs.${pluginKey}_${variableKey.toUpperCase()} }}\n`
  })

  return metadata
}

function generateActionMetadata(): string {
  logger({ message: "Generating action metadata", level: "info" })
  let metadata = getTemplate("actionMetadata")

  // Generate main env variables metadata
  Object.entries(MAIN_ENV_VARIABLES).forEach(([key]) => {
    metadata += `        ${key.toUpperCase()}: \${{ inputs.${key.toUpperCase()} }}\n`
  })

  metadata += divider

  // Generate plugin metadata
  pluginManager.getAllPlugins().forEach((plugin) => {
    metadata += generatePluginMetadata(plugin)
  })

  return metadata
}

function saveActionMetadata(content: string): void {
  try {
    const actionPath = path.join(rootDir, "action.yml")
    if (fs.existsSync(actionPath)) {
      logger({ message: `Overwriting action.yml file in ${rootDir}`, level: "info" })
    } else {
      logger({ message: `Creating action.yml file in ${rootDir}`, level: "info" })
    }
    fs.writeFileSync(actionPath, content)
  } catch (err) {
    logger({ message: `Error: ${err}`, level: "error" })
  }
}
