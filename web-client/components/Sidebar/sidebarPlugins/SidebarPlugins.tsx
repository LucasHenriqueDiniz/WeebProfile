import * as Accordion from "@radix-ui/react-accordion"
import classNames from "classnames"
import React from "react"
import { FaChevronDown } from "react-icons/fa"
import PluginVariables from "source/plugins/@types/PluginVariables"
import MAIN_ENV_VARIABLES from "source/plugins/ENV_VARIABLES"
import plugins, { Plugin, PluginProps } from "source/plugins/plugins"

import useStore from "web-client/app/store"

import { PluginSwitchInput } from "./FormComponents/SwitchInput"
import InputText from "./FormComponents/TextInput"
import RenderPluginInput from "./RenderPluginInput"
import "./SidebarPlugins.css"

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Accordion.Item>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item className={classNames("AccordionItem", className)} {...props} ref={forwardedRef}>
      {children}
    </Accordion.Item>
  )
)

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Accordion.Trigger>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className='AccordionHeader'>
      <Accordion.Trigger className={classNames("AccordionTrigger", className)} {...props} ref={forwardedRef}>
        {children}
        <FaChevronDown
          className='AccordionChevron text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)]'
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
)

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Accordion.Content>>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content className={classNames("AccordionContent", className)} {...props} ref={forwardedRef}>
      {children}
    </Accordion.Content>
  )
)

AccordionContent.displayName = "AccordionContent"
AccordionTrigger.displayName = "AccordionTrigger"
AccordionItem.displayName = "AccordionItem"

function RenderSectionConfigs<T>(plugin: Plugin<T>, section: string) {
  const sectionConfigs = Object.entries(plugin.envVariables).filter(([_key, value]) =>
    (value as { sections?: string[] }).sections?.includes(section)
  )
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
      <div className='relative size-full' key={section}>
        {/* Section Title */}
        <div className={`plugin-section-switch ${isSectionActive ? "active" : ""}`}>
          <PluginSwitchInput
            name={section}
            onChange={handleSectionToggle}
            value={isSectionActive}
            label={`${section}`}
          />
        </div>
        {/* Section Configs */}
        <div className={`plugin-section-container ${isSectionActive ? "active" : ""}`}>
          {sectionConfigs.map(([key, value]: [string, PluginVariables]) => (
            <RenderPluginInput name={key} pluginName={plugin.name} pluginVariables={value} key={key} />
          ))}
        </div>
      </div>
    )
  )
}

const PluginTitle = ({ name, children }: { name: string; children?: React.ReactNode }) => {
  return (
    <>
      <div className={`plugin-title-container ${children ? "has-children" : ""}`}>
        <h3 className={"plugins-sidebar-title"}>
          <span className='divider-before'></span>
          {name}
          <span className='divider-after'></span>
        </h3>
        {children && <div className={"plugin-sidebar-title-wrapper"}>{children}</div>}
      </div>
    </>
  )
}

const SidebarPlugins = () => {
  const { githubUser, setGithubUser } = useStore()
  return (
    <>
      <Accordion.Root className='AccordionRoot' type='single' defaultValue='item-1' collapsible>
        <PluginTitle name='Global Configurations'>
          <div className='grid'>
            <div className='grid w-full'>
              <InputText
                name={"Github Username"}
                label={"Github Username"}
                value={githubUser || ""}
                onChange={(e) => {
                  e.preventDefault()
                  setGithubUser(e.target.value)
                }}
                required={true}
                description={"The GitHub username that will be used create the markdown url"}
              />
            </div>
            {Object.entries(MAIN_ENV_VARIABLES).map(([key, value]) => {
              if (key === "sections" || key === "storage_method") return null
              return (
                <div key={key} className='grid w-full'>
                  <RenderPluginInput name={key} pluginVariables={value} pluginName={"global"} />
                </div>
              )
            })}
          </div>
        </PluginTitle>
        <PluginTitle name='Plugins'>
          {plugins.map((plugin) => (
            <AccordionItem key={plugin.name} value={plugin.name}>
              <AccordionTrigger name={plugin.name}>{plugin.name.replace(/_/g, " ")}</AccordionTrigger>
              <AccordionContent>
                <PluginTitle name='Main Configurations'>
                  {Object.entries(plugin.envVariables)
                    .filter(([_key, value]) => value.sections?.includes("main")) // Render only the variables with section "main"
                    .filter(([key, _value]) => key !== "sections")
                    .map(([key, value]) => (
                      <div key={key} className='grid w-full'>
                        <RenderPluginInput name={key} pluginVariables={value} pluginName={plugin.name} key={key} />
                      </div>
                    ))}
                </PluginTitle>
                <PluginTitle name={`${plugin.name} Sections`}>
                  {plugin.sections.map((section) => {
                    return RenderSectionConfigs(plugin as Plugin<PluginProps>, section)
                  })}
                </PluginTitle>
              </AccordionContent>
            </AccordionItem>
          ))}
        </PluginTitle>
      </Accordion.Root>
    </>
  )
}
export default SidebarPlugins
