import { FaBookOpen, FaCalendar, FaStar, FaVideo } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { Stat } from "templates/Default/Default_StatRow";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import TerminalLineWithDots from "templates/Terminal/Terminal_LineWithDots";
import getEmojiStatus from "core/utils/getEmojiStatus";
import getPseudoCommands from "core/utils/getPseudoCommands";
import { MalStatisticsResponse } from "../types/malStatisticsResponse";
import React from "react";
import ErrorMessage from "source/templates/Error_Style";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import { abbreviateNumber } from "source/helpers/number";
import MAL_ENV_VARIABLES from "../ENV_VARIABLES";

export default function SimpleStatistics({ data }: { data: MalStatisticsResponse }): JSX.Element {
  const { myanimelist } = getEnvVariables();
  if (!myanimelist) throw new Error("MAL plugin not found in MalStatistics component");
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />;

  const title = myanimelist.statistics_simple_title ?? (MAL_ENV_VARIABLES.statistics_simple_title.defaultValue as string);
  const hideTitle = myanimelist.statistics_simple_hide_title;

  const TotalDays = data.anime.days_watched + data.manga.days_read;
  const TotalMeanScore =
    (data.anime.mean_score * data.anime.total_entries + data.manga.mean_score * data.manga.total_entries) /
    (data.anime.total_entries + data.manga.total_entries);
  const ChaptersRead = data.manga.chapters_read;
  const EpisodesWatched = data.anime.episodes_watched;

  return (
    <section id="mal" className="simple-statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <ul className="simple default-status-horizontal">
              <Stat title="Days Wasted" strong value={TotalDays.toFixed(1)} icon={<FaCalendar className="color-primary pb-2" />} />
              <Stat title="Mean Score" strong value={TotalMeanScore.toFixed(2)} icon={<FaStar className="color-primary pb-2" />} />
              <Stat title="Chapters Read" strong value={abbreviateNumber(ChaptersRead)} icon={<FaBookOpen className="color-primary pb-2" />} smallInHalf />
              <Stat title="Episodes Watched" strong value={abbreviateNumber(EpisodesWatched)} icon={<FaVideo className="color-primary pb-2" />} smallInHalf />
            </ul>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "mal", section: "simple-statistics", username: myanimelist.username, type: "all" })} />
            <TerminalLineWithDots title={`${getEmojiStatus("days_wasted")} Days Wasted`} value={TotalDays.toFixed(1)} />
            <TerminalLineWithDots title={`${getEmojiStatus("mean_score")} Mean Score`} value={TotalMeanScore.toFixed(2)} />
            <TerminalLineWithDots title={`${getEmojiStatus("chapters_read")} Chapters Read`} value={abbreviateNumber(ChaptersRead)} />
            <TerminalLineWithDots title={`${getEmojiStatus("episodes_watched")} Episodes Watched`} value={abbreviateNumber(EpisodesWatched)} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}
