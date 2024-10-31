import * as RadioGroup from "@radix-ui/react-radio-group"
import React from "react"

import DescriptionTooltip from "./DescriptionTooltip"
import "./FormComponents.css"

interface RadioInputProps {
  name: string
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  required?: boolean
  description?: string
}

const RadioInput: React.FC<RadioInputProps> = ({ name, label, options, value, onChange, required, description }) => {
  return (
    <div className='form-input-container'>
      <label htmlFor={name} className='form-input-label'>
        {label}
        {description && <DescriptionTooltip description={description} required={required} />}
      </label>
      <div>
        <RadioGroup.Root
          className='radio-plugins-root'
          aria-label={`Radio Form for input ${label}`}
          onValueChange={(e) => onChange(e)}
          defaultValue={value}
        >
          {options.map((option) => (
            <div style={{ display: "flex", alignItems: "center" }} key={option}>
              <RadioGroup.Item className='radio-plugins-item' value={option} id={name}>
                <RadioGroup.Indicator className='radio-plugins-indicator' />
              </RadioGroup.Item>
              <label className='radio-plugins-label' htmlFor='r1'>
                {option.replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </RadioGroup.Root>
      </div>
    </div>
  )
}

export default RadioInput
