import { FaAward, FaBoxOpen, FaCode, FaDonate, FaGitAlt, FaGithub, FaHeart, FaStar, FaUserFriends } from "react-icons/fa";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { StatisticRow } from "templates/Default/Default_StatRow";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import TerminalLineWithDots from "templates/Terminal/Terminal_LineWithDots";
import getPseudoCommands from "core/utils/getPseudoCommands";
import Img64 from "core/src/base/ImageComponent";
import { UserData } from "../types";
import React from "react";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import { abbreviateNumber } from "source/helpers/number";

const DefaultProfile = ({ userData }: { userData: UserData }) => {
  const years = new Date().getFullYear() - new Date(userData.createdAt).getFullYear();

  const allMetrics = [
    { icon: <FaUserFriends className="color-primary" />, title: "Followers", value: userData.followers.totalCount },
    { icon: <FaHeart className="default-completed" />, title: "Following", value: userData.following.totalCount },
    { icon: <FaCode className="color-primary" />, title: "Gists", value: userData.gists.totalCount },
    { icon: <FaBoxOpen className="default-completed" />, title: "Packages", value: userData.packages.totalCount },
    {
      icon: <FaDonate className="color-primary" />,
      title: "Sponsorships",
      value: userData.sponsorshipsAsMaintainer.totalCount + userData.sponsorshipsAsSponsor.totalCount,
    },
    { icon: <FaStar className="default-completed" />, title: "Starred Repos", value: userData.starredRepositories?.totalCount || 0 },
    { icon: <FaAward className="color-primary" />, title: "Achievements", value: 0 }, // Placeholder for future achievements
    { icon: <FaGitAlt className="default-completed" />, title: "Repositories", value: userData.repositories.totalCount },
  ];

  const relevantMetrics = allMetrics
    .filter((metric) => metric.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const firstRow = relevantMetrics.slice(0, 2);
  const secondRow = relevantMetrics.slice(2, 4);

  return (
    <div className="flex flex-d gap-4 mt-8">
      <div className="flex flex-d gap-2">
        <span className="color-primary md-text flex items-center">
          <FaGithub className="mr-2" />
          Joined GitHub {years} years ago
        </span>
        <span className="color-primary md-text flex items-center">
          <RiGitRepositoryCommitsLine className="mr-2" />
          Contributed to {userData.repositoriesContributedTo.totalCount} repositories
        </span>
      </div>

      <div className="w100 flex justify-between">
        <StatisticRow rows={firstRow.map((metric) => ({ icon: metric.icon, title: metric.title, value: abbreviateNumber(metric.value), strong: true }))} />
        <StatisticRow
          className="align-flexend"
          rows={secondRow.map((metric) => ({ icon: metric.icon, title: metric.title, value: abbreviateNumber(metric.value), strong: true }))}
        />
      </div>
    </div>
  );
};

const TerminalProfile = ({ userData }: { userData: UserData }) => {
  const years = new Date().getFullYear() - new Date(userData.createdAt).getFullYear();

  const allMetrics = [
    { icon: <FaUserFriends className="color-primary" />, title: "Followers", value: userData.followers.totalCount },
    { icon: <FaHeart className="default-completed" />, title: "Following", value: userData.following.totalCount },
    { icon: <FaCode className="color-primary" />, title: "Gists", value: userData.gists.totalCount },
    { icon: <FaBoxOpen className="default-completed" />, title: "Packages", value: userData.packages.totalCount },
    {
      icon: <FaDonate className="color-primary" />,
      title: "Sponsorships",
      value: userData.sponsorshipsAsMaintainer.totalCount + userData.sponsorshipsAsSponsor.totalCount,
    },
    { icon: <FaStar className="default-completed" />, title: "Starred Repos", value: userData.starredRepositories?.totalCount || 0 },
    { icon: <FaAward className="color-primary" />, title: "Achievements", value: 0 }, // Placeholder for future achievements
    { icon: <FaGitAlt className="default-completed" />, title: "Repositories", value: userData.repositories.totalCount },
  ];

  const relevantMetrics = allMetrics
    .filter((metric) => metric.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <>
      <TerminalLineWithDots title="On GitHub" value={`${years}+ years`} />
      {relevantMetrics.map((metric) => (
        <TerminalLineWithDots key={metric.title} title={metric.title} value={abbreviateNumber(metric.value)} />
      ))}
    </>
  );
};

export default function GithubProfile({ userData }: { userData: UserData }): JSX.Element {
  const { pluginGithub } = getEnvVariables();
  if (!pluginGithub) throw new Error("Github plugin not found in GithubProfile component");

  const title = userData.name;
  const hideTitle = pluginGithub.profile_hide_title;

  const Avatar = () => (
    <div className="avatar">
      <Img64 url64={userData.avatarUrl} alt={`${userData.name}'s avatar`} width={36} height={36} />
    </div>
  );
  return (
    <section id="github" className="github-profile">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<Avatar />} />}
            <DefaultProfile userData={userData} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand command={getPseudoCommands({ plugin: "github", section: "profile", username: pluginGithub.username })} />
            <TerminalProfile userData={userData} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}
