import React from "react"
import { IoMdCloseCircleOutline } from "react-icons/io"

import DescriptionTooltip from "./DescriptionTooltip"
import "./FormComponents.css"

const InputText = ({
  name,
  label,
  value,
  onChange,
  required,
  description,
  onDelete,
}: {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  description?: string
  onDelete?: () => void
}) => {
  return (
    <div className='form-input-container'>
      <label htmlFor={name} className='form-input-label'>
        {label}
        {description && <DescriptionTooltip description={description} required={required} />}
      </label>
      <div className='relative size-full'>
        <input type='text' name={name} className='text-plugins-input' value={value} onChange={onChange} />
        {onDelete && (
          <IoMdCloseCircleOutline
            className={`absolute bottom-1/2 right-1 translate-y-1/2 cursor-pointer text-gray-300 transition-all hover:text-gray-500 ${
              value?.trim() === "" ? "hidden" : ""
            } active:scale-90`}
            onClick={() => onDelete()}
          />
        )}
      </div>
    </div>
  )
}

export default InputText
