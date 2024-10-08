import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6";
import { AnimeStatistics, MangaStatistics } from "../../../../types/malStatisticsResponse";
import getPseudoCommands from "../../../../utils/getPseudoCommands";
import { Stat } from "../../!templates/Default/Default_StatRow";
import DefaultTitle from "../../!templates/Default/Default_Title";
import RenderBasedOnStyle from "../../!templates/RenderBasedOnStyle";
import TerminalCommand from "../../!templates/Terminal/Terminal_Command";
import TerminalLineBreak from "../../!templates/Terminal/Terminal_LineBreak";

interface HorizontalBarProps {
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  planToWatch: number;
}

const HorizontalBar = ({ watching, completed, onHold, dropped, planToWatch }: HorizontalBarProps): JSX.Element => {
  const total = watching + completed + onHold + dropped + planToWatch;

  const watchingPercent = (watching / total) * 100;
  const completedPercent = (completed / total) * 100;
  const onHoldPercent = (onHold / total) * 100;
  const droppedPercent = (dropped / total) * 100;
  const planToWatchPercent = (planToWatch / total) * 100;

  return (
    <div className="horizontal-status-bar">
      <span className="bar-section default-bg-watching" style={{ width: `${watchingPercent}%` }}></span>
      <span className="bar-section default-bg-completed" style={{ width: `${completedPercent}%` }}></span>
      <span className="bar-section default-bg-on-hold" style={{ width: `${onHoldPercent}%` }}></span>
      <span className="bar-section default-bg-dropped" style={{ width: `${droppedPercent}%` }}></span>
      <span className="bar-section default-bg-plan-to-watch" style={{ width: `${planToWatchPercent}%` }}></span>
    </div>
  );
};

export default function StatisticsHorizontalBar({ animeOrMangaData }: { animeOrMangaData: AnimeStatistics | MangaStatistics }): JSX.Element {
  const watching = animeOrMangaData.watching || animeOrMangaData.reading;
  const completed = animeOrMangaData.completed;
  const onHold = animeOrMangaData.on_hold;
  const dropped = animeOrMangaData.dropped;
  const planToWatch = animeOrMangaData.plan_to_watch || animeOrMangaData.plan_to_read;
  const isAnime = "days_watched" in animeOrMangaData;

  return (
    <section>
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <DefaultTitle title={isAnime ? "Anime" : "Manga"} />
            <HorizontalBar watching={watching} completed={completed} onHold={onHold} dropped={dropped} planToWatch={planToWatch} />
            <ul className="default-status-horizontal">
              <Stat title={isAnime ? "Watching" : "Reading"} value={watching.toString()} icon={<FaCirclePlay className="default-watching" />} />
              <Stat title="Completed" value={completed.toString()} icon={<FaCircleCheck className="default-completed" />} />
              <Stat title="On Hold" value={onHold.toString()} icon={<FaCirclePause className="default-on-hold" />} />
              <Stat title="Dropped" value={dropped.toString()} icon={<FaCircleXmark className="default-dropped" />} />
              <Stat title="Plan to Watch" value={planToWatch.toString()} icon={<FaQuestionCircle className="default-plan-to-watch" />} />
            </ul>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "mal", section: "statistics", username: "username", type: isAnime ? "anime" : "manga" })} />
            <span>TODO</span>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}
