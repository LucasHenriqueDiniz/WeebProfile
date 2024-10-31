import React from "react";
import ErrorMessage from "./Error_Style";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";

const RenderBasedOnStyle = ({ terminalComponent, defaultComponent }: { terminalComponent: JSX.Element; defaultComponent: JSX.Element }): JSX.Element => {
  const { style } = getEnvVariables();

  switch (style) {
    case "default":
      return defaultComponent;
    case "terminal":
      return terminalComponent;
    default:
      return <ErrorMessage message={`Style ${style} not found`} />;
  }
};

export default RenderBasedOnStyle;
