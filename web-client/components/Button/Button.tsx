import classNames from "classnames"
import React, { MouseEventHandler, ReactNode } from "react"
import "./Button.css"

type ButtonVariant = "primary" | "secondary" | "danger" | "unstyled" | "ghost"
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
  beforeIcon?: ReactNode
  afterIcon?: ReactNode
}

type ButtonComponent = React.FC<ButtonProps>

const Button: ButtonComponent = ({
  children,
  onClick,
  variant,
  className,
  ariaLabel,
  style,
  size,
  asDiv,
  beforeIcon,
  afterIcon,
}) => {
  variant ??= "primary"
  size ??= "md"
  const isUnstyled = variant === "unstyled"

  const classes = isUnstyled ? className : classNames("button", `button-${variant}`, `button-${size}`, className)

  if (asDiv) {
    return (
      <div className={classes} style={style} onClick={onClick as MouseEventHandler<HTMLDivElement>} title={ariaLabel}>
        {beforeIcon && <span className="button-icon before">{beforeIcon}</span>}
        {children}
        {afterIcon && <span className="button-icon after">{afterIcon}</span>}
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
      {beforeIcon && <span className="button-icon before">{beforeIcon}</span>}
      {children}
      {afterIcon && <span className="button-icon after">{afterIcon}</span>}
    </button>
  )
}

export default Button
