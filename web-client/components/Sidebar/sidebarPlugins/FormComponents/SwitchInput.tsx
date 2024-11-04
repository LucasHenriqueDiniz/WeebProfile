import * as Switch from "@radix-ui/react-switch"
import React from "react"

import "./FormComponents.css"
import DescriptionTooltip from "./DescriptionTooltip"

interface SwitchInputProps {
  name: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
  required?: boolean
  description?: string
}

export const SwitchInput: React.FC<SwitchInputProps> = ({ name, label, value, onChange, description, required }) => {
  return (
    <div className="form-input-container">
      <label htmlFor={name} className="form-input-label">
        {label}
        {description && <DescriptionTooltip description={description} required={required} />}
      </label>
      <Switch.Root className="switch-plugins-root" id={name} checked={value} onCheckedChange={onChange}>
        <Switch.Thumb className="switch-plugins-thumb" />
      </Switch.Root>
    </div>
  )
}

export const PluginSwitchInput = ({ name, label, value, onChange }: SwitchInputProps) => {
  return (
    <div className="flex w-full items-center justify-between px-1">
      <label htmlFor={name} className="form-input-label active-plugin">
        {label.replace(/_/g, " ")}
      </label>
      <Switch.Root className="switch-plugins-root active-plugin" id={name} checked={value} onCheckedChange={onChange}>
        <Switch.Thumb className="switch-plugins-thumb active-plugin" />
      </Switch.Root>
    </div>
  )
}
