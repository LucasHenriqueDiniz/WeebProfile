import React from "react";
import { LuCircleDot } from "react-icons/lu";
import { ClassicProfileProps, MalProfileStatsProps } from "../types/malTypes";
import { LastUpdateItem, ProfileHeader, StatisticsBar } from "./classic_components";

function ProfileStats({ data, userName }: MalProfileStatsProps) {
  const isAnime = "days_watched" in data;

  const days = data.days_watched ?? data.days_read;
  const meanScore = data.mean_score;
  const watching = data.watching ?? data.reading;
  const completed = data.completed;
  const onHold = data.on_hold;
  const dropped = data.dropped;
  const planToWatch = data.plan_to_watch ?? data.plan_to_read;

  const totalEntries = data.total_entries;
  const rewatched = data.rewatched ?? data.reread;
  const episodes = data.episodes_watched ?? undefined;
  const chapters = data.chapters_read ?? undefined;
  const volumes = data.volumes_read ?? undefined;

  return (
    <div className="stat-score table w100 pt-8">
      <div className="flex w100 align-center justify-between">
        <div className="pl-8 sm-text fw-b">
          <span className="fn-grey2 fw-n">Days: </span>
          <span className="score-label">{days}</span>
        </div>
        <div className="pr-8 sm-text fw-b">
          <span className="text-gray fw-n">Mean Score: </span>
          <span className="score-label">{meanScore}</span>
        </div>
      </div>
      {StatisticsBar({ watching, completed, onHold, dropped, planToWatch })}
      <div className="mt-12 ml-8 mr-8 clearfix">
        <ul className="stats-status fl-l">
          <li className="stats-status-li mb-12">
            <a href={`https://myanimelist.net/${isAnime ? "animelist" : "mangalist"}/Amayacrab?status=1`} className="status-text">
              <LuCircleDot size={20} className="f_watching" />
              {isAnime ? "Watching" : "Reading"}
            </a>
            <span className="di-ib lh10">{watching}</span>
          </li>
          <li className="stats-status-li mb-12">
            <a href={`https://myanimelist.net/${isAnime ? "animelist" : "mangalist"}/Amayacrab?status=2`} className="status-text">
              <LuCircleDot size={20} className="f_completed" />
              Completed
            </a>
            <span className="di-ib lh10">{completed}</span>
          </li>
          <li className="stats-status-li mb-12">
            <a href={`https://myanimelist.net/${isAnime ? "animelist" : "mangalist"}/Amayacrab?status=3`} className="status-text">
              <LuCircleDot size={20} className="f_on_hold" />
              On-Hold
            </a>
            <span className="di-ib lh10">{onHold}</span>
          </li>
          <li className="stats-status-li mb-12">
            <a href={`https://myanimelist.net/${isAnime ? "animelist" : "mangalist"}/Amayacrab?status=4`} className="status-text">
              <LuCircleDot size={20} className="f_dropped" />
              Dropped
            </a>
            <span className="di-ib lh10">{dropped}</span>
          </li>
          <li className="stats-status-li mb-12">
            <a href={`https://myanimelist.net/${isAnime ? "animelist" : "mangalist"}/Amayacrab?status=6`} className="status-text">
              <LuCircleDot size={20} className="f_plan_to_watch" />
              {isAnime ? "Plan to Watch" : "Plan to Read"}
            </a>
            <span className="di-ib lh10">{planToWatch}</span>
          </li>
        </ul>
        <ul className="stats-data fl-r">
          <li className="clearfix mb-12">
            <span className="di-ib fl-l fn-grey2">Total Entries</span>
            <span className="di-ib fl-r">{totalEntries}</span>
          </li>
          <li className="clearfix mb-12">
            <span className="di-ib fl-l fn-grey2">{isAnime ? "Rewatched" : "Reread"}</span>
            <span className="di-ib fl-r">{rewatched}</span>
          </li>
          {isAnime ? (
            <li className="clearfix mb-12">
              <span className="di-ib fl-l fn-grey2">Episodes</span>
              <span className="di-ib fl-r">{episodes}</span>
            </li>
          ) : (
            <>
              <li className="clearfix mb-12">
                <span className="di-ib fl-l fn-grey2">Chapters</span>
                <span className="di-ib fl-r">{chapters}</span>
              </li>
              <li className="clearfix mb-12">
                <span className="di-ib fl-l fn-grey2">Volumes</span>
                <span className="di-ib fl-r">{volumes}</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

function ClassicProfile({ statisticsData, lastUpdatesData, username }: ClassicProfileProps): JSX.Element {
  const isAnime = "days_watched" in statisticsData;
  const media = isAnime ? "anime" : "manga";
  const lastUpdatesHtml = lastUpdatesData.map((data) => LastUpdateItem({ data, stat: media }));
  const profileStatsHtml = ProfileStats({ data: statisticsData, userName: username });

  return (
    <div className="profile-stats half:flex-d">
      <ProfileHeader
        title={isAnime ? "Anime Stats" : "Manga Stats"}
        secondTitle={isAnime ? "All Anime Stats" : "All Manga Stats"}
        secondTitleHref={`https://myanimelist.net/profile/${username}/statistics/${media}-scores`}
        children={profileStatsHtml}
      />

      <ProfileHeader
        title={isAnime ? "Last Anime Updates" : "Last Manga Updates"}
        secondTitle={isAnime ? "Anime History" : "Manga History"}
        secondTitleHref={`https://myanimelist.net/history/${username}/${media}`}
        children={<>{lastUpdatesHtml}</>}
      />
    </div>
  );
}

export default ClassicProfile;
