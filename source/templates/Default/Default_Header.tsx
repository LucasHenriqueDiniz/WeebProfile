import React from "react"

interface Props {
  icon: JSX.Element
  title: string
}

export const Header = ({ icon, title }: Props): JSX.Element => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-primary-75 md-text-bold ">|</span>
      <div className="text-lg font-bold">{title}</div>
    </div>
  )
}

export default Header
