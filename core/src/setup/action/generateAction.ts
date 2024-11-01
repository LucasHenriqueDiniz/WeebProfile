import { execSync } from "child_process"
import logger from "core/utils/logger"
import fs from "fs"
import path from "path"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import plugins from "source/plugins/plugins"

const rootDir = path.resolve(__dirname, "..", "..", "..", "..")
const divider = "# ====================================================================================\n"

logger({ message: "Generating action", level: "info", header: true })
const inputs = generateInputs()
const metadata = generateActionMetadata()
saveActionMetadata(inputs + metadata)

// run prettier on the generated action.yml file
logger({ message: "Running prettier on action.yml", level: "info" })
execSync("npx prettier --write action.yml", { stdio: "inherit" })

function generateInputs() {
  logger({ message: "Generating inputs", level: "info" })
  let inputs = "inputs:\n"
  Object.entries(MAIN_ENV_VARIABLES).forEach(([key, variable]) => {
    inputs += `  ${key.toUpperCase()}:\n`
    inputs += `    description: "${variable.description}"\n`
    inputs += `    required: ${variable.required ?? false}\n`
    if (variable.defaultValue) {
      inputs += `    default: "${variable.defaultValue}"\n`
    }
  })

  Object.entries(plugins).forEach(([_key, plugin]) => {
    inputs += divider
    const pluginKey = `PLUGIN_${plugin.name.toUpperCase()}`
    inputs += `  # ${plugin.name} Plugin\n`
    inputs += `  ${pluginKey}:\n`
    inputs += `    description: "Enable ${plugin.name} Plugin"\n`
    inputs += '    default: "false"\n'
    inputs += "    required: false\n"
    Object.entries(plugin.envVariables).forEach(([variableKey, variable]) => {
      inputs += `  ${pluginKey}_${variableKey.toUpperCase()}:\n`
      inputs += `    description: "${variable.description}${variable.required ? " | Needed for plugin to work" : ""}"\n`
      inputs += "    required: false\n"
      if (variable.defaultValue) {
        inputs += `    default: "${variable.defaultValue}"\n`
      }
    })
  })

  inputs += divider

  return inputs
}

function getTemplate(template: string) {
  if (!fs.existsSync(path.join(__dirname, `templates/${template}.yml`))) {
    logger({ message: `Template ${template} not found`, level: "error" })
    process.exit(1)
  }

  return fs.readFileSync(path.join(__dirname, `templates/${template}.yml`), "utf8")
}

function generateActionMetadata() {
  logger({ message: "Generating action metadata", level: "info" })
  let metadata = getTemplate("actionMetadata")

  Object.entries(MAIN_ENV_VARIABLES).forEach(([key, _variable]) => {
    metadata += `        ${key.toUpperCase()}: \${{ inputs.${key.toUpperCase()} }}\n`
  })

  metadata += divider

  Object.entries(plugins).forEach(([_key, plugin]) => {
    const pluginKey = `PLUGIN_${plugin.name.toUpperCase()}`
    metadata += `        ${pluginKey}: \${{ inputs.${pluginKey} }}\n`
    Object.entries(plugin.envVariables).forEach(([variableKey, _variable]) => {
      metadata += `        ${pluginKey}_${variableKey.toUpperCase()}: \${{ inputs.${pluginKey}_${variableKey.toUpperCase()} }}\n`
    })
  })

  return metadata
}

function saveActionMetadata(content: string) {
  try {
    if (fs.existsSync(path.join(rootDir, "action.yml"))) {
      logger({ message: `Overwriting action.yml file in ${rootDir}`, level: "info" })
    } else {
      logger({ message: `Creating action.yml file in ${rootDir}`, level: "info" })
    }
    fs.writeFileSync(path.join(rootDir, "action.yml"), content)
  } catch (err) {
    logger({ message: `Error: ${err}`, level: "error" })
  }
}
