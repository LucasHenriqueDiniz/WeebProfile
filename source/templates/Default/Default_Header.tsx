import React from "react";

interface Props {
  icon: JSX.Element;
  title: string;
}

export const Header = ({ icon, title }: Props): JSX.Element => {
  return (
    <div className="flex items-center gap-4">
      {icon}
      <span className="default-header-divider">|</span>
      <div className="xl-text-bold flex-center">{title}</div>
    </div>
  );
};

export default Header;
