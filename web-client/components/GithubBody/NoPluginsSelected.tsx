import React from "react"
import { FiInbox } from "react-icons/fi"

const NoPluginsSelected = () => {
  return (
    <div className="color-gray flex size-full flex-col items-center justify-center ">
      <FiInbox className="size-8" />
      <p className="mt-4 text-lg">First, select a plugin from the sidebar</p>
    </div>
  )
}

export default NoPluginsSelected
