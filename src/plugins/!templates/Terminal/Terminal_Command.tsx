import React from "react";

const TerminalCommand = ({ command, className }: { command: string; className?: string }): JSX.Element => {
  return (
    <div className={`terminal-command sm-text ${className}`}>
      <span className="text-bold text-sucess">root</span>@<span className="text-bold text-sucess">weeb-profile</span>:<span className="text-highlight">~</span>
      <span className="text-raw">$ {command}</span>
    </div>
  );
};

export default TerminalCommand;
