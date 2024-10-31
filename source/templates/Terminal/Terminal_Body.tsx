import React from "react";

const TerminalBody = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return <div className="terminal-body">{children}</div>;
};

export default TerminalBody;
