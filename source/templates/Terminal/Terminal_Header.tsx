import React from "react";
import { GoDotFill } from "react-icons/go";
import { LiaWindowCloseSolid, LiaWindowMaximizeSolid, LiaWindowMinimize } from "react-icons/lia";

const LeftSection = () => {
  return (
    <div className="left-section">
      <div className="flex items-center">
        <GoDotFill color="red" />
        <GoDotFill color="yellow" />
        <GoDotFill color="green" />
      </div>
    </div>
  );
};

const UrlSection = () => {
  return (
    <div className="flex items-center justify-center w100">
      <span className="text-overflow text-center sm-text text-muted">
        <span className="text-bold text-success">root</span>@<span className="text-bold text-success">weeb-profile</span>: ~
      </span>
    </div>
  );
};

const RightSection = () => {
  return (
    <div className="right-section">
      <LiaWindowMinimize className="half:hidden" />
      <LiaWindowMaximizeSolid className="half:hidden" />
      <LiaWindowCloseSolid />
    </div>
  );
};

function TerminalHeader(): JSX.Element {
  return (
    <div className="terminal-navbar">
      <LeftSection />
      <UrlSection />
      <RightSection />
    </div>
  );
}

export default TerminalHeader;
