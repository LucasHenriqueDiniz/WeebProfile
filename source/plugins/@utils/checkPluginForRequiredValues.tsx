import React from "react"
import logger from "source/helpers/logger"
import ErrorMessage from "source/templates/Error_Style"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CheckPluginForRequiredValues<T extends Record<string, any>, D extends Record<string, any>>({
  plugin,
  ENV_VARIABLES,
  pluginName,
}: {
  plugin: T
  ENV_VARIABLES: D
  pluginName: string
}): JSX.Element | null {
  if (!plugin) {
    return <ErrorMessage message={`${pluginName} plugin is not initialized or found.`} />
  }

  if (!ENV_VARIABLES) {
    logger({
      message: `Environment variables (ENV_VARIABLES) for ${pluginName} are missing or not provided.`,
      level: "error",
      __filename,
    })
    return (
      <ErrorMessage message={`Environment variables (ENV_VARIABLES) for ${pluginName} are missing or not provided.`} />
    )
  }

  // Verifica se o plugin está habilitado
  if (!plugin.plugin_enabled) {
    logger({
      message: `${pluginName} plugin is not enabled.`,
      level: "debug",
      __filename,
    })
    return <ErrorMessage message={`${pluginName} plugin is not enabled.`} />
  }

  // Verifica valores obrigatórios
  for (const key of Object.keys(ENV_VARIABLES)) {
    const variable = ENV_VARIABLES[key as keyof typeof ENV_VARIABLES]

    // Verifica se a variável é obrigatória e se tem um valor válido
    if (variable.required && (!plugin[key] || plugin[key] === "")) {
      return <ErrorMessage message={`The required variable "${String(key)}" is missing in the ${pluginName} plugin.`} />
    }
  }

  return null // Sem erros, continua renderização
}

export default CheckPluginForRequiredValues
