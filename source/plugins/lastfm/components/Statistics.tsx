import { IoStatsChartOutline } from "react-icons/io5";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalDots from "templates/Terminal/Terminal_Dots";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import TerminalLineWithDots from "templates/Terminal/Terminal_LineWithDots";
import getPseudoCommands from "core/utils/getPseudoCommands";
import Img64 from "core/src/base/ImageComponent";
import { LastFmData, LastFmFeaturedTrack } from "../types/lastFmTypes";
import React from "react";
import ErrorMessage from "source/templates/Error_Style";
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import { abbreviateNumber } from "helpers/number";

const statisticsList = [
  { title: "Scrobbles", key: "totalScrobbles" },
  { title: "Artists", key: "totalArtists" },
  // { title: "Loved Tracks", key: "lovedTracks" },
];

const DefaultFeaturedTrack = ({ track }: { track: LastFmFeaturedTrack }): JSX.Element => {
  return (
    <>
      <div className="flex-d align-flexend h100 justify-evenly w100">
        <p className="sm-text-bold">Top Track</p>
        <p className="md-text-bold text-overflow text-nowrap w-fit text-end">{track.track}</p>
        <p className="md-2-text text-gray line-100 text-nowrap text-overflow w-fit text-end">{track.artist}</p>
      </div>
      <div className="featured-image-container">
        <Img64 url64={track.image} alt={track.track} defaultType="lastfm" className="music-image" />
      </div>
    </>
  );
};

const DefaultStatistic = ({ title, value }: { title: string; value: string }): JSX.Element => (
  <div className="text-center px-4 text-nowrap">
    <h3 className="capitalize md-text-bold text-gray line-100">{title}</h3>
    <p className="lg-text-bold">{abbreviateNumber(value)}</p>
  </div>
);

const TerminalFeaturedTrack = ({ track }: { track: LastFmFeaturedTrack }): JSX.Element => {
  return (
    <div className="terminal-statistic sm-text text-overflow">
      <span className="z-2">Top Track:</span>
      <TerminalDots />
      <span className="text-bold z-2">
        {track.track} - {track.artist}
      </span>
    </div>
  );
};

function LastFMStatistics({ data }: { data: LastFmData }): JSX.Element {
  const { lastfm } = getEnvVariables();
  if (!lastfm) throw new Error("LastFM plugin not found in LastFMStatistics component");
  if (!data) return <ErrorMessage message="No data found in LastFMStatistics component" />;

  const hideTitle = lastfm.statistics_hide_title;
  const title = lastfm.statistics_title ?? (LASTFM_ENV_VARIABLES.statistics_title.defaultValue as string);

  return (
    <section id="last-fm" className="statistics">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<IoStatsChartOutline />} />}
            <div className="h-64 max-h-64 featured-grid">
              <div className="flex gap-4">
                {statisticsList.map(({ title, key }) => (
                  <DefaultStatistic key={key} title={title} value={data[key]} />
                ))}
              </div>
              {data.featuredTrack && <DefaultFeaturedTrack track={data.featuredTrack} />}
            </div>
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "lastfm", section: "statistics", username: lastfm.username })} />
            {statisticsList.map(({ title, key }) => (
              <TerminalLineWithDots key={key} title={title} value={data[key]} />
            ))}
            {data.featuredTrack && <TerminalFeaturedTrack track={data.featuredTrack} />}
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}

export default LastFMStatistics;
