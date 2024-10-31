import React from "react"
import Select from "react-select"
import makeAnimated from "react-select/animated"

import DescriptionTooltip from "./DescriptionTooltip"
import "./FormComponents.css"

const animatedComponents = makeAnimated()

interface SelectorInputProps {
  name: string
  label: string
  options: string[]
  value: string | string[]
  onChange: (values: string[]) => void
  required: boolean
  description?: string
}

const SelectorInput: React.FC<SelectorInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  required,
  description,
}) => {
  const formattedValue = typeof value === "string" ? value.split(",") : value
  const processedOptions = options.map((option) => ({
    value: option,
    label: option.replace(/_/g, " ").toUpperCase(),
  }))

  return (
    <div className='form-input-container'>
      <label htmlFor={name} className='form-input-label'>
        {label}
        {description && <DescriptionTooltip description={description} required={required} />}
      </label>
      <Select
        components={animatedComponents}
        options={processedOptions}
        onChange={(selectedOptions) => onChange(selectedOptions.map((option) => option.value))}
        isMulti
        value={formattedValue.map((option) => ({ value: option, label: option.replace(/_/g, " ").toUpperCase() }))}
        isClearable={false}
        aria-label={name}
        classNames={{
          input: () => "selector-plugins-input",
          multiValue: () => "selector-plugins-value",
          multiValueLabel: () => "selector-plugins-value-label",
          multiValueRemove: () => "selector-plugins-value-remove",
          container: () => "selector-plugins-container",
          control: () => "selector-plugins-control",
          option: () => "selector-plugins-option",
          menuList: () => "selector-plugins-menu-list",
          indicatorSeparator: () => "selector-plugins-indicator-separator",
          menu: () => "selector-plugins-menu",
        }}
      />
    </div>
  )
}

export default SelectorInput
