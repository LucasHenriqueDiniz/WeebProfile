import React from "react"
import { EnvironmentManager } from "source/plugins/@utils/EnvManager"
import ErrorMessage from "./Error_Style"

const RenderBasedOnStyle = ({
  terminalComponent,
  defaultComponent,
}: {
  terminalComponent: JSX.Element
  defaultComponent: JSX.Element
}): JSX.Element => {
  const envManager = EnvironmentManager.getInstance()
  const env = envManager.getEnv()
  const style = env.style

  switch (style) {
    case "default":
      return defaultComponent
    case "terminal":
      return terminalComponent
    default:
      return <ErrorMessage message={`Style ${style} not found`} />
  }
}

export default RenderBasedOnStyle
