import React from "react";

export interface StatProps {
  title: string;
  value: string;
  strong?: boolean;
  icon?: JSX.Element;
  className?: string;
  smallInHalf?: boolean;
}

function Stat({ icon, title, value, strong, className, smallInHalf }: StatProps): JSX.Element {
  return (
    <li className={`default-stat ${strong ? "md-text" : "sm-text"} ${smallInHalf ? "half:md-2-text" : ""} ${className ? className : ""}`}>
      {icon && icon}
      <span>{value}</span>
      <span>{title}</span>
    </li>
  );
}

interface StatisticsRowProps {
  icon: JSX.Element;
  title: string;
  value: string;
  strong?: boolean;
}

function StatisticRow({ rows, className }: { rows: StatisticsRowProps[]; className?: string }): JSX.Element {
  return (
    <ul className={`default-status-vertical ${className ? className : ""}`}>
      {rows.map((row, index) => (
        <Stat key={index} title={row.title} value={row.value} icon={row.icon} strong={row.strong} />
      ))}
    </ul>
  );
}

export { Stat, StatisticRow };
