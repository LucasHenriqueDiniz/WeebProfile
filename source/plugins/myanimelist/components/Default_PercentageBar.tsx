import React from "react";
import { FaCheck, FaQuestion } from "react-icons/fa";

function PercentageBar({ current, total, status }: { current: number; total: number; status: string }): JSX.Element {
  //if needed to be used in another component, add a prop for isCompleted(full bar with check) and isPlanTo(don't show bar and add ?)
  let percentage = total > 0 ? (current / total) * 100 : 50;
  const isCompleted = status === "Completed";
  const isPlanTo = status === "Plan to Watch" || status === "Plan to Read";

  if (isCompleted) percentage = 100;
  if (isPlanTo) percentage = -1;

  return (
    <div className="w100 flex drop-shadow color-bg-primary-15 radius-16 h-15 default-percentage-bar">
      <span
        className={`${isCompleted || isPlanTo ? "flex-center" : "flex-end"} bg-${status.toLowerCase().split(" ").join("-")} ${
          isPlanTo ? "bg-transparent" : ""
        } text-shadow align-center radius-16 sm-text `}
        style={{ width: `${isCompleted || isPlanTo ? 100 : percentage}%` }}
      >
        {isPlanTo ? <FaQuestion /> : isCompleted ? <FaCheck /> : <span className="pr-8 text-bold">{current ? `${percentage.toFixed(0)}%` : "?"}</span>}
      </span>
      {percentage < 97 && <p className="flex-end pr-8 sm-text align-center color-white-50 absolute right-0 h100 half:xs-text">{total === 0 ? "?" : total}</p>}
    </div>
  );
}

export default PercentageBar;
