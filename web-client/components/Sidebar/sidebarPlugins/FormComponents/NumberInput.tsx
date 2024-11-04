import React from "react"

import DescriptionTooltip from "./DescriptionTooltip"
import "./FormComponents.css"

const InputNumber = ({
  name,
  label,
  value,
  onChange,
  required,
  description,
}: {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  description?: string
}) => {
  return (
    <div className="form-input-container">
      <label htmlFor={name} className="form-input-label">
        {label}
        {description && <DescriptionTooltip description={description} required={required} />}
      </label>
      <input type="number" name={name} className="text-plugins-input" value={value} onChange={onChange} />
    </div>
  )
}

export default InputNumber
