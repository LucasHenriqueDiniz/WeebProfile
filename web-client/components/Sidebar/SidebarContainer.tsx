"use client"
import PluginsAccordion from "./sidebarPlugins/SidebarPlugins"

const SidebarContainer = () => {
  return (
    <div className="profile-data-container">
      <div className="profile-data-flex">
        <PluginsAccordion />
      </div>
    </div>
  )
}

export default SidebarContainer
