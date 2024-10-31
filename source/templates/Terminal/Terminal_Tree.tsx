import React from "react";
import { GridItemProps } from "../types";

// [TEST TREE]
// ├── title
// │   ├── subtitle?
// │   └── value
// └── another gird item ...

//@TODO
// Add support for childrne
// make title, children {value, subtitle, sla} and value optional

const TerminalTree = ({ data, title }: { data: GridItemProps[]; title: string }): JSX.Element => {
  const renderTreeItem = (item: GridItemProps, last = false) => {
    const { title, subtitle, value } = item;

    const T = () => <span className="text-raw">├──</span>;
    const S = () => <span className="text-raw">│</span>;
    const L = () => <span className="text-raw">└──</span>;
    const N = () => <span></span>;

    return (
      <div className="flex-d md-2-text" key={title}>
        <div className="tree-title text-bold">
          {last ? <L /> : <T />} {title}
        </div>
        <div className="text-muted tree-content">
          {subtitle && (
            <>
              {last ? <N /> : <S />}
              <T /> <span>{subtitle}</span>
            </>
          )}
        </div>
        <div className="text-muted tree-content">
          {last ? <N /> : <S />}
          <L /> <span>{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="terminal-tree">
      <div className="text-raw md-text text-bold text-uppercase">{title}</div>
      {data.map((item, index) => renderTreeItem(item, index === data.length - 1))}
    </div>
  );
};

export default TerminalTree;
