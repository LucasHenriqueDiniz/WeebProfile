import getPseudoCommands from "core/utils/getPseudoCommands";
import React from "react";
import { AiOutlineTrophy } from "react-icons/ai";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import ErrorMessage from "source/templates/Error_Style";
import List from "templates/Default/Default_List";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import TerminalList from "templates/Terminal/Terminal_List";
import { ListItemProps } from "templates/types";
import { TopTrack } from "../types/lastFmTypes";
import { abbreviateNumber } from "source/helpers/number";
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES";

interface Props {
  data: TopTrack[];
  interval: string | undefined;
}

function LastFmTopTracksList({ data, interval }: Props): JSX.Element {
  const { lastfm } = getEnvVariables();
  if (!lastfm) throw new Error("LastFM plugin not found in TopTracksList component");
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in LastFmTopTracksList component" />;
  }
  const title = lastfm.top_tracks_title ?? (LASTFM_ENV_VARIABLES.top_tracks_title.defaultValue as string);
  const hideTitle = lastfm.top_tracks_hide_title;
  const hideIntervals = lastfm.hide_intervals;
  const customInterval = lastfm.top_tracks_interval_text?.trim();
  if (customInterval) {
    interval = customInterval;
  }

  const maxItems = lastfm.top_tracks_max ?? (LASTFM_ENV_VARIABLES.top_tracks_max.defaultValue as number);
  const dataLength = data.length;

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    data = data.slice(0, maxItems);
  }

  const ListItems = data.map((track) => ({
    right: track.track,
    image: track.image,
    center: track.artist,
    left: abbreviateNumber(track.plays) + " plays",
  })) as ListItemProps[];

  return (
    <section id="last-fm" className="top-tracks">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<AiOutlineTrophy />} />}
            <List data={ListItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({ plugin: "lastfm", section: "top_tracks", username: lastfm.username, period: interval, limit: maxItems })}
            />
            <TerminalList data={ListItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}

export default LastFmTopTracksList;
