import React from "react"
import ErrorMessage from "source/templates/Error_Style"

function CheckPluginForRequiredValues<T, D>({
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
    return (
      <ErrorMessage message={`Environment variables (ENV_VARIABLES) for ${pluginName} are missing or not provided.`} />
    )
  }

  for (const key of Object.keys(ENV_VARIABLES as object) as Array<keyof typeof ENV_VARIABLES>) {
    const variable = ENV_VARIABLES[key as keyof typeof ENV_VARIABLES]

    // @TODO find a way to don't use any, i am too lazy to do it now :(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((variable as { required: boolean }).required && !(plugin as any)[key]) {
      return <ErrorMessage message={`The required variable "${String(key)}" is missing in the ${pluginName} plugin.`} />
    }
  }

  return null // No errors, continue render
}

export default CheckPluginForRequiredValues
