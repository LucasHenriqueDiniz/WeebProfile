import { abbreviateNumber } from "helpers/number";
import getEmojiStatus from "core/utils/getEmojiStatus";
import getPseudoCommands from "core/utils/getPseudoCommands";
import React from "react";
import { FaBookOpen, FaCalendar, FaDatabase, FaQuestionCircle, FaStar, FaVideo } from "react-icons/fa";
import { FaCircleCheck, FaCirclePause, FaCirclePlay, FaCircleXmark } from "react-icons/fa6";
import { IoStatsChartOutline } from "react-icons/io5";
import { MdOutlineRestartAlt } from "react-icons/md";
import { StatisticRow } from "templates/Default/Default_StatRow";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalGrid from "templates/Terminal/Terminal_Grid";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import { GridItemProps } from "templates/types";
import { MalStatisticsResponse } from "../types/malStatisticsResponse";
import ErrorMessage from "source/templates/Error_Style";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import MAL_ENV_VARIABLES from "../ENV_VARIABLES";

export default function MalStatistics({ data }: { data: MalStatisticsResponse }): JSX.Element {
  const { myanimelist } = getEnvVariables();
  if (!myanimelist) throw new Error("MAL plugin not found in MalStatistics component");
  if (!data) return <ErrorMessage message="No data found in MalStatistics component" />;

  const animeStatistics = data.anime;
  const mangaStatistics = data.manga;

  const hideTitle = myanimelist.statistics_hide_title;
  const statisticsMedia = myanimelist.statistics_media ?? (MAL_ENV_VARIABLES.statistics_media.defaultValue as string);
  const mangaTitle = myanimelist.statistics_manga_title ?? (MAL_ENV_VARIABLES.statistics_manga_title.defaultValue as string);
  const animeTitle = myanimelist.statistics_anime_title ?? (MAL_ENV_VARIABLES.statistics_anime_title.defaultValue as string);

  const showBoth = statisticsMedia === "both";
  const showAnime = showBoth || statisticsMedia === "anime";
  const showManga = showBoth || statisticsMedia === "manga";

  const animeDataAsGridItemProps: GridItemProps[] = [
    {
      title: "Mean Score",
      value: animeStatistics.mean_score.toString(),
    },
    {
      title: "Total Days",
      value: animeStatistics.days_watched.toString(),
    },
    {
      title: "Total Entries",
      value: abbreviateNumber(animeStatistics.total_entries),
    },
    {
      title: "Rewatched",
      value: abbreviateNumber(animeStatistics.rewatched),
    },
    {
      title: "Episodes Watched",
      value: abbreviateNumber(animeStatistics.episodes_watched),
    },
    {
      title: "Watching",
      value: abbreviateNumber(animeStatistics.watching),
    },
    {
      title: "Completed",
      value: abbreviateNumber(animeStatistics.completed),
    },
    {
      title: "On Hold",
      value: abbreviateNumber(animeStatistics.on_hold),
    },
    {
      title: "Dropped",
      value: abbreviateNumber(animeStatistics.dropped),
    },
    {
      title: "Plan to Watch",
      value: abbreviateNumber(animeStatistics.plan_to_watch),
    },
  ];

  animeDataAsGridItemProps.forEach((item) => {
    item.title = getEmojiStatus(item.title) + " " + item.title;
  });

  const mangaDataAsGridItemProps: GridItemProps[] = [
    {
      title: "Mean Score",
      value: mangaStatistics.mean_score.toString(),
    },
    {
      title: "Total Days",
      value: mangaStatistics.days_read.toString(),
    },
    {
      title: "Total Entries",
      value: abbreviateNumber(mangaStatistics.total_entries),
    },
    {
      title: "Reread",
      value: abbreviateNumber(mangaStatistics.reread),
    },
    {
      title: "Chapters Read",
      value: abbreviateNumber(mangaStatistics.chapters_read),
    },
    {
      title: "Volumes Read",
      value: abbreviateNumber(mangaStatistics.volumes_read),
    },
    {
      title: "Watching",
      value: abbreviateNumber(mangaStatistics.reading),
    },
    {
      title: "Completed",
      value: abbreviateNumber(mangaStatistics.completed),
    },
    {
      title: "On Hold",
      value: abbreviateNumber(mangaStatistics.on_hold),
    },
    {
      title: "Dropped",
      value: abbreviateNumber(mangaStatistics.dropped),
    },
    {
      title: "Plan to Read",
      value: abbreviateNumber(mangaStatistics.plan_to_read),
    },
  ];

  mangaDataAsGridItemProps.forEach((item) => {
    item.title = getEmojiStatus(item.title) + " " + item.title;
  });

  return (
    <section id="mal" className="statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            <div className="w100 flex half:flex-d gap-4">
              {showAnime && (
                <div className="flex-d w100">
                  {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={animeTitle || "Anime Statistics"} />}
                  <div className="w100 flex">
                    <StatisticRow
                      rows={[
                        { icon: <FaStar className="color-primary" />, title: "Mean Score", value: abbreviateNumber(animeStatistics.mean_score), strong: true },
                        { icon: <FaCirclePlay className="default-watching" />, title: "Watching", value: abbreviateNumber(animeStatistics.watching) },
                        { icon: <FaCircleCheck className="default-completed" />, title: "Completed", value: abbreviateNumber(animeStatistics.completed) },
                        { icon: <FaCirclePause className="default-on-hold" />, title: "On Hold", value: abbreviateNumber(animeStatistics.on_hold) },
                        { icon: <FaCircleXmark className="default-dropped" />, title: "Dropped", value: abbreviateNumber(animeStatistics.dropped) },
                        {
                          icon: <FaQuestionCircle className="default-plan-to-watch" />,
                          title: "Plan to Watch",
                          value: abbreviateNumber(animeStatistics.plan_to_watch),
                        },
                      ]}
                    />
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaCalendar className="color-primary" />,
                          title: "Total Days",
                          value: abbreviateNumber(animeStatistics.days_watched),
                          strong: true,
                        },
                        { icon: <FaDatabase className="color-primary" />, title: "Total Entries", value: abbreviateNumber(animeStatistics.total_entries) },
                        { icon: <MdOutlineRestartAlt className="color-primary" />, title: "Rewatched", value: abbreviateNumber(animeStatistics.rewatched) },
                        { icon: <FaVideo className="color-primary" />, title: "Episodes Watched", value: abbreviateNumber(animeStatistics.episodes_watched) },
                      ]}
                    />
                  </div>
                </div>
              )}
              {showManga && (
                <div className="flex-d w100">
                  {!hideTitle && <DefaultTitle icon={<IoStatsChartOutline />} title={mangaTitle || "Manga Statistics"} />}
                  <div className="w100 flex">
                    <StatisticRow
                      rows={[
                        { icon: <FaStar className="color-primary" />, title: "Mean Score", value: abbreviateNumber(mangaStatistics.mean_score), strong: true },
                        { icon: <FaCirclePlay className="default-watching" />, title: "Watching", value: abbreviateNumber(mangaStatistics.reading) },
                        { icon: <FaCircleCheck className="default-completed" />, title: "Completed", value: abbreviateNumber(mangaStatistics.completed) },
                        { icon: <FaCirclePause className="default-on-hold" />, title: "On Hold", value: abbreviateNumber(mangaStatistics.on_hold) },
                        { icon: <FaCircleXmark className="default-dropped" />, title: "Dropped", value: abbreviateNumber(mangaStatistics.dropped) },
                        {
                          icon: <FaQuestionCircle className="default-plan-to-watch" />,
                          title: "Plan to Watch",
                          value: abbreviateNumber(mangaStatistics.plan_to_read),
                        },
                      ]}
                    />
                    <StatisticRow
                      rows={[
                        {
                          icon: <FaCalendar className="color-primary" />,
                          title: "Total Days",
                          value: abbreviateNumber(mangaStatistics.days_read),
                          strong: true,
                        },
                        { icon: <FaDatabase className="color-primary" />, title: "Total Entries", value: abbreviateNumber(mangaStatistics.total_entries) },
                        { icon: <MdOutlineRestartAlt className="color-primary" />, title: "Reread", value: abbreviateNumber(mangaStatistics.reread) },
                        { icon: <FaBookOpen className="color-primary" />, title: "Chapters Read", value: abbreviateNumber(mangaStatistics.chapters_read) },
                        { icon: <FaVideo className="color-primary" />, title: "Volumes Read", value: abbreviateNumber(mangaStatistics.volumes_read) },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "mal", section: "statistics", username: myanimelist.username, type: "all" })} />
            <div className="w100 flex half:flex-d gap-4">
              {showAnime && (
                <div className="flex-d w100">
                  <TerminalGrid data={animeDataAsGridItemProps} rightText="Anime Statistics" centerText="Values" />
                </div>
              )}
              <TerminalLineBreak className="hidden half:block" />
              {showManga && (
                <div className="flex-d w100">
                  <TerminalGrid data={mangaDataAsGridItemProps} rightText="Manga Statistics" centerText="Values" />
                </div>
              )}
            </div>
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}
