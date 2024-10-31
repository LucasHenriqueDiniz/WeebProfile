import classNames from "classnames"
import React, { MouseEventHandler, ReactNode } from "react"
import "./Button.css"

type ButtonVariant = "primary" | "secondary" | "danger" | "unstyled"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLDivElement>
  variant?: ButtonVariant
  className?: string
  ariaLabel?: string
  size?: ButtonSize
  style?: React.CSSProperties
  asDiv?: boolean
}

type ButtonComponent = React.FC<ButtonProps>

const Button: ButtonComponent = ({ children, onClick, variant, className, ariaLabel, style, size, asDiv }) => {
  variant ??= "primary"
  size ??= "md"
  const isUnstyled = variant === "unstyled"

  const classes = isUnstyled ? className : classNames("button", `button-${variant}`, `button-${size}`, className)

  if (asDiv) {
    return (
      <div className={classes} style={style} onClick={onClick as MouseEventHandler<HTMLDivElement>} title={ariaLabel}>
        {children}
      </div>
    )
  }

  return (
    <button
      className={classes}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button
