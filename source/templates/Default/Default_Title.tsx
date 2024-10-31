import React from "react";

interface DefaultTitleProps {
  icon?: JSX.Element;
  title: string;
  subtitle?: string | null;
}

export default function DefaultTitle({ icon, title, subtitle }: DefaultTitleProps): JSX.Element {
  return (
    <div className="default-title">
      {icon && icon}
      <div className="flex justify-between w100">
        <h2 className="lg-text-bold text-shadow">{title}</h2>
        {subtitle && <h3 className="sm-text text-shadow flex align-flexend">{subtitle}</h3>}
      </div>
    </div>
  );
}
