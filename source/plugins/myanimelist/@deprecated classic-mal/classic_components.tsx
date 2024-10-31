import { format } from "date-fns";
import React from "react";
import { StatisticsBarProps, ProgressBarProps, MalProfileBoxProps, LastUpdateItemProps } from "../types/malTypes";
import { LastUpdatesAnime, LastUpdatesManga } from "../../../../types/malLastUpdatesResponse";
import Img64 from "../../../base/ImageComponent";

function StatisticsBar({ watching, completed, onHold, dropped, planToWatch }: StatisticsBarProps) {
  const total = watching + completed + onHold + dropped + planToWatch;
  const watchingWidth = (watching / total) * 100;
  const completedWidth = (completed / total) * 100;
  const onHoldWidth = (onHold / total) * 100;
  const droppedWidth = (dropped / total) * 100;
  const planToWatchWidth = (planToWatch / total) * 100;

  return (
    <span className="stats-graph mt-8">
      <span className="graph watching" style={{ width: `${watchingWidth}%` }} />
      <span className="graph completed" style={{ width: `${completedWidth}%` }} />
      <span className="graph on_hold" style={{ width: `${onHoldWidth}%` }} />
      <span className="graph dropped" style={{ width: `${droppedWidth}%` }} />
      <span className="graph plan_to_watch" style={{ width: `${planToWatchWidth}%` }} />
    </span>
  );
}

function ProgressBar({ value, total, status = "completed" }: ProgressBarProps) {
  // @TODO // implement progress bar like profile stats
  var percentage = (value / total) * 100;

  if (isNaN(percentage)) {
    percentage = 50;
  }

  return (
    <div className="progress-graph">
      <span className={`graph-inner ${status.toLowerCase()}`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

function ProfileHeader({ title, secondTitle, secondTitleHref, children }: MalProfileBoxProps) {
  return (
    <section>
      <div className="stats h100">
        <h5 className="mb-12 stat-title">
          <a className="floatRightHeader" href={secondTitleHref}>
            {secondTitle}
          </a>
          {title}
        </h5>
        <div className="container h100">{children}</div>
      </div>
    </section>
  );
}

function LastUpdateItem({ data, stat }: LastUpdateItemProps) {
  const isAnime = stat === "anime";
  const imgSrc = data.entry.images.jpg?.base64;

  const title = data.entry.title;
  const score = data.score;
  const status = data.status;
  const date = format(new Date(data.date), "MMM d, h:mm a");

  const episodes_seen = isAnime ? (data as LastUpdatesAnime).episodes_seen ?? 0 : (data as LastUpdatesManga).chapters_read ?? 0;
  const episodes_total = isAnime ? (data as LastUpdatesAnime).episodes_total ?? 0 : (data as LastUpdatesManga).chapters_total ?? 0;
  const animeHref = data.entry.url;

  return (
    <div className="flex w100 h100 mb8">
      <a href={animeHref} className="fl-l di-ib mr8 last-update-image-container">
        <Img64 url64={imgSrc} alt={title} className="last-update-image" width={40} height={56} />
      </a>
      <div className="data flex-d w100">
        <a className="text-decoration-none" href={animeHref}>
          {title}
        </a>
        <div className="flex pt8 w100 gap-8">
          {ProgressBar({ value: episodes_seen, total: episodes_total, status: status })}
          <span className="fn-grey2 text-nowrap">{date}</span>
        </div>
        <div className="fn-grey2 flex gap-4 align-center">
          {status}
          <strong className="text-white"> {episodes_seen === 0 ? "?" : episodes_seen} </strong>/ {episodes_total === 0 ? "?" : episodes_total} · Scored
          <strong className="text-white">{score}</strong>
        </div>
      </div>
    </div>
  );
}

export { StatisticsBar, ProgressBar, ProfileHeader, LastUpdateItem };
