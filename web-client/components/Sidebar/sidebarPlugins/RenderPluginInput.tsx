import React from "react"
import PluginVariables from "source/plugins/@types/PluginVariables"

import useStore from "web-client/app/store"

import InputNumber from "./FormComponents/NumberInput"
import RadioInput from "./FormComponents/RadioInput"
import SelectorInput from "./FormComponents/SelectorInput"
import { SwitchInput } from "./FormComponents/SwitchInput"
import InputText from "./FormComponents/TextInput"
import { getDefaultValue } from "source/plugins/@utils/PluginManager"

const RenderPluginInput = ({
  name,
  pluginVariables,
  pluginName,
}: {
  name: string
  pluginVariables: PluginVariables
  pluginName: string
}) => {
  const { pluginsConfig, updateConfigKey } = useStore()
  const required = pluginVariables?.required ?? false
  const type = pluginVariables?.type ?? "string"
  const defaultValue = pluginVariables?.defaultValue ?? getDefaultValue(type)
  const label = name.replace(/_/g, " ")
  const options = pluginVariables?.options ?? []
  const isGlobalConfigs = pluginName === "global"
  const description = pluginVariables?.description

  switch (type) {
    case "string":
      return (
        <InputText
          name={name}
          label={label}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          onChange={(e) => {
            e.preventDefault()
            updateConfigKey(pluginName, name, e.target.value)
          }}
          onDelete={() => updateConfigKey(pluginName, name, "")}
          required={required}
          description={description}
        />
      )
    case "number":
      return (
        <InputNumber
          name={name}
          label={label}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          onChange={(e) => {
            e.preventDefault()
            updateConfigKey(pluginName, name, e.target.value)
          }}
          required={required}
          description={description}
        />
      )
    case "stringArray":
      return (
        <SelectorInput
          name={name}
          label={label}
          required={required}
          onChange={(e) => updateConfigKey(pluginName, name, e)}
          options={options}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          description={description}
        />
      )
    case "stringRadio":
      return (
        <RadioInput
          name={name}
          label={label}
          required={required}
          onChange={(e) => updateConfigKey(pluginName, name, e)}
          options={options}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          description={description}
        />
      )
    case "boolean":
      return (
        <SwitchInput
          name={name}
          label={label}
          onChange={(e) => updateConfigKey(pluginName, name, e)}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          required={required}
          description={description}
        />
      )
    default:
      return (
        <InputText
          name={name}
          label={label}
          value={isGlobalConfigs ? pluginsConfig[name] : (pluginsConfig[pluginName]?.[name] ?? defaultValue)}
          onChange={(e) => {
            e.preventDefault()
            updateConfigKey(pluginName, name, e.target.value)
          }}
          required={required}
        />
      )
  }
}

export default RenderPluginInput
