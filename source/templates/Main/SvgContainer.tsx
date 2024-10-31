import getSvgWidth from "core/utils/getSvgWidth";
import React from "react";

interface MalProfileBoxProps {
  children: JSX.Element;
  size: string;
  height: number | string;
  style: string;
  asDiv?: boolean;
}

function SvgContainer({ children, size, height, style, asDiv }: MalProfileBoxProps) {
  const isHalf = size === "half";

  if (asDiv) {
    return (
      <div className={`${size} ${style}`} style={{ width: getSvgWidth(isHalf) }} id="svg-main">
        {children}
      </div>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" id="svg-main" width={getSvgWidth(isHalf)} height={height} className={`${size} ${style}`}>
      {children}
    </svg>
  );
}

export default SvgContainer;
