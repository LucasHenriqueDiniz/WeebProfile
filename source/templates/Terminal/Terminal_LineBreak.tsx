import React from "react";

const TerminalLineBreak = ({ className }: { className?: string }): JSX.Element => (
  <div className={`terminal-line-break ${className}`}>
    ============================================================================================================================================================
  </div>
);

export default TerminalLineBreak;
