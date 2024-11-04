import * as Accordion from "@radix-ui/react-accordion"
import React, { useEffect } from "react"
import { Plugin, PluginName } from "source/plugins/@types/plugins"
import { PluginManager } from "source/plugins/@utils/PluginManager"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import useStore from "web-client/app/store"
import { PluginSwitchInput } from "./FormComponents/SwitchInput"
import InputText from "./FormComponents/TextInput"
import { AccordionContent, AccordionItem, AccordionTrigger } from "./PluginsAccordion"
import RenderPluginInput from "./RenderPluginInput"
import "./SidebarPlugins.css"

function RenderSectionConfigs(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: Plugin<PluginName, any, any>,
  section: string
) {
  const sectionConfigs = Object.entries(plugin.envVariables).filter(([_, value]) => value.sections?.includes(section))

  const { pluginsConfig, updateConfigKey } = useStore()

  const handleSectionToggle = () => {
    const currentSections = pluginsConfig[plugin.name]?.sections ?? []
    const newSections = currentSections.includes(section)
      ? currentSections.filter((s: string) => s !== section)
      : [...currentSections, section]
    updateConfigKey(plugin.name, "sections", newSections)
  }

  const isSectionActive = pluginsConfig[plugin.name]?.sections?.includes(section)

  return (
    sectionConfigs.length > 0 && (
      <div className="relative size-full" key={section}>
        {/* Section Title */}
        <div className={`plugin-section-switch ${isSectionActive ? "active" : ""}`}>
          <PluginSwitchInput
            name={section}
            onChange={handleSectionToggle}
            value={isSectionActive ?? false}
            label={section}
          />
        </div>
        {/* Section Configs */}
        <div className={`plugin-section-container ${isSectionActive ? "active" : ""}`}>
          {sectionConfigs.map(([key, value]) => (
            <RenderPluginInput key={key} name={key} pluginName={plugin.name} pluginVariables={value} />
          ))}
        </div>
      </div>
    )
  )
}

const PluginTitle = ({ name, children }: { name: string; children?: React.ReactNode }) => (
  <div className={`plugin-title-container ${children ? "has-children" : ""}`}>
    <h3 className="plugins-sidebar-title">
      <span className="divider-before" />
      {name}
      <span className="divider-after" />
    </h3>
    {children && <div className="plugin-sidebar-title-wrapper">{children}</div>}
  </div>
)

const SidebarPlugins = () => {
  const pluginManager = PluginManager.getInstance()
  const { githubUser, setGithubUser } = useStore()
  const allPlugins = pluginManager.getAllPlugins()

  useEffect(() => {
    // Initialize the store to update the PluginManager with the active plugins
    useStore.getState().initializeStore()
  }, [])

  return (
    <Accordion.Root className="AccordionRoot" type="single" defaultValue="item-1" collapsible>
      <PluginTitle name="Global Configurations">
        <div className="grid">
          <div className="grid w-full">
            <InputText
              name="Github Username"
              label="Github Username"
              value={githubUser || ""}
              onChange={(e) => setGithubUser(e.target.value)}
              required={true}
              description="The GitHub username that will be used create the markdown url"
            />
          </div>
          {Object.entries(MAIN_ENV_VARIABLES)
            .filter(([key]) => !["sections", "storage_method", "custom_css", "custom_path", "dev"].includes(key))
            .map(([key, value]) => (
              <div key={key} className="grid w-full">
                <RenderPluginInput name={key} pluginVariables={value} pluginName="global" />
              </div>
            ))}
        </div>
      </PluginTitle>

      <PluginTitle name="Plugins">
        {allPlugins.map((plugin) => (
          <AccordionItem key={plugin.name} value={plugin.name}>
            <AccordionTrigger name={plugin.name}>{plugin.name.replace(/_/g, " ")}</AccordionTrigger>
            <AccordionContent>
              <PluginTitle name="Main Configurations">
                {Object.entries(plugin.envVariables)
                  .filter(([key, value]) => value.sections?.includes("main") && key !== "sections")
                  .map(([key, value]) => (
                    <div key={key} className="grid w-full">
                      <RenderPluginInput name={key} pluginVariables={value} pluginName={plugin.name} />
                    </div>
                  ))}
              </PluginTitle>

              <PluginTitle name={`${plugin.name} Sections`}>
                {plugin.sections.map((section) => RenderSectionConfigs(plugin, section))}
              </PluginTitle>
            </AccordionContent>
          </AccordionItem>
        ))}
      </PluginTitle>
    </Accordion.Root>
  )
}

export default SidebarPlugins
