import React from "react";
import { MdOutlinePersonOutline } from "react-icons/md";
import { LastFmArtist } from "../types/lastFmTypes";
import getPseudoCommands from "core/utils/getPseudoCommands";
import List from "templates/Default/Default_List";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import TerminalList from "templates/Terminal/Terminal_List";
import { ListItemProps } from "templates/types";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import LASTFM_ENV_VARIABLES from "../ENV_VARIABLES";
import ErrorMessage from "source/templates/Error_Style";
import { abbreviateNumber } from "source/helpers/number";

interface Props {
  data: LastFmArtist[];
  interval: string | undefined;
}

function TopArtistsList({ data, interval }: Props): JSX.Element {
  const { lastfm } = getEnvVariables();
  if (!lastfm) throw new Error("LastFM plugin not found in TopArtistsList component");
  if (!data || data.length === 0) {
    return <ErrorMessage message="No data found in TopArtistsList component" />;
  }

  const title = lastfm.top_artists_title ?? (LASTFM_ENV_VARIABLES.top_artists_title.defaultValue as string);
  const hideTitle = lastfm.top_artists_hide_title ?? (LASTFM_ENV_VARIABLES.top_artists_hide_title.defaultValue as string);
  const hideIntervals = lastfm.hide_intervals;
  const customInterval = lastfm.top_artists_interval_text?.trim();
  if (customInterval) {
    interval = customInterval;
  }

  const maxItems = lastfm.top_artists_max ?? (LASTFM_ENV_VARIABLES.top_artists_max.defaultValue as number);
  const dataLength = data.length;

  //limit the data to the maxItems
  if (maxItems && dataLength > maxItems) {
    console.log(`Limiting data to ${maxItems} items`);
    data = data.slice(0, maxItems);
  }

  const ListItems = data.map((artist) => ({
    right: artist.artist,
    image: artist.image,
    left: abbreviateNumber(artist.totalPlays) + " plays",
  })) as ListItemProps[];

  return (
    <section id="last-fm" className="top-artists">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} subtitle={hideIntervals ? undefined : interval} icon={<MdOutlinePersonOutline />} />}
            <List data={ListItems} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "lastfm", section: "top_artists_default", username: lastfm.username, period: interval })} />
            <TerminalList data={ListItems} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}

export default TopArtistsList;
