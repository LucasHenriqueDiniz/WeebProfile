import React from "react";
import { ClassicLastUpdatesProps } from "../types/malTypes";
import { LastUpdateItem, ProfileHeader } from "./classic_components";

function ClassicLastUpdates({ lastUpdatesData, username }: ClassicLastUpdatesProps): JSX.Element {
  const isAnime = "episodes_seen" in lastUpdatesData;
  const media = isAnime ? "anime" : "manga";
  const lastUpdatesHtml = lastUpdatesData.map((data) => LastUpdateItem({ data, stat: media }));

  return (
    <div className="profile-stats half:flex-d">
      {lastUpdatesHtml.length > 0 && (
        <ProfileHeader
          title={isAnime ? "Last Anime Updates" : "Last Manga Updates"}
          secondTitle={isAnime ? "Anime History" : "Manga History"}
          secondTitleHref={`https://myanimelist.net/history/${username}/${media}`}
          children={<>{lastUpdatesHtml}</>}
        />
      )}
    </div>
  );
}

export default ClassicLastUpdates;
