/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import logger from "source/helpers/logger"
import { Header } from "templates/Default/Default_Header"
import ErrorMessage from "templates/Error_Style"
import RenderBasedOnStyle from "templates/RenderBasedOnStyle"
import TerminalBody from "templates/Terminal/TerminalBody"
import CheckPluginForRequiredValues from "../@utils/checkPluginForRequiredValues"
import Favorites from "./components/Favorites"
import Statistics from "./components/Statistics"
import ENV_VARIABLES, { ExampleSections } from "./ENV_VARIABLES"
import { ExamplePluginData } from "./types"

// Map of section names to their renderer components
const sectionRenderers: Record<string, (data: ExamplePluginData) => JSX.Element> = {
  favorites: (data) => <Favorites {...data.favorites} />,
  statistics: (data) => <Statistics {...data.statistics} />,
}

/**
 * Main renderer for the Example plugin
 * Demonstrates how to:
 * - Handle different sections
 * - Use plugin configuration
 * - Implement error handling
 * - Support different styles (default/terminal)
 */

// In a real plugin this would be typed
function RenderExamplePlugin({ plugin, data }: { plugin: any; data: any }): React.ReactNode {
  logger({ message: `Rendering example plugin sections`, level: "info", __filename })

  // Basic error handling
  if (!data) return <ErrorMessage message="Example plugin data not found in RenderExamplePlugin" />

  // Check if all required environment variables are set
  const error = CheckPluginForRequiredValues({
    plugin,
    ENV_VARIABLES: ENV_VARIABLES,
    pluginName: "example",
  })
  if (error) return error

  const sections = plugin.sections
  const hideHeader = plugin.hide_header

  // Helper function to render individual sections
  const renderSection = (section: string): JSX.Element => {
    if (sectionRenderers[section]) {
      return sectionRenderers[section](data)
    }
    logger({
      message: `Section "${section}" not found, available sections: \n${ExampleSections.join("\n")}`,
      level: "error",
      __filename,
    })
    return <ErrorMessage message={`Section ${section} not found`} />
  }

  // Support both terminal and default styles
  return (
    <RenderBasedOnStyle
      terminalComponent={
        <TerminalBody>
          {sections.map((section: string) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </TerminalBody>
      }
      defaultComponent={
        <>
          {!hideHeader && <Header icon={<span>🔥</span>} title={"Example Plugin"} />}
          {sections.map((section: string) => (
            <div key={section}>{renderSection(section)}</div>
          ))}
        </>
      }
    />
  )
}

export default RenderExamplePlugin
