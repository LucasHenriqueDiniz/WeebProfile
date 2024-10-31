import React from "react";
import TerminalDots from "./Terminal_Dots";

const TerminalLineWithDots = ({ title, value }: { title: string; value: string }): JSX.Element => (
  <div className="terminal-statistic sm-text">
    <span className="text-bold z-2">{title}</span>
    <TerminalDots />
    <span className="z-2">{value}</span>
  </div>
);

export default TerminalLineWithDots;
