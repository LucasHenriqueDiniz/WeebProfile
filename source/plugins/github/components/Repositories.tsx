import {
  RiEyeLine,
  RiFileCodeLine,
  RiGitBranchLine,
  RiGitClosePullRequestLine,
  RiGitForkLine,
  RiGitMergeLine,
  RiGitPullRequestLine,
  RiGitRepositoryLine,
  RiStarLine,
} from "react-icons/ri";
import { StatisticRow } from "templates/Default/Default_StatRow";
import DefaultTitle from "templates/Default/Default_Title";
import RenderBasedOnStyle from "templates/RenderBasedOnStyle";
import TerminalCommand from "templates/Terminal/Terminal_Command";
import TerminalGrid from "templates/Terminal/Terminal_Grid";
import TerminalLineBreak from "templates/Terminal/Terminal_LineBreak";
import getPseudoCommands from "core/utils/getPseudoCommands";
import { RepositoriesData } from "../types";
import React from "react";
import getEnvVariables from "source/plugins/@utils/getEnvVariables";
import { abbreviateNumber } from "source/helpers/number";

interface Metric {
  icon: JSX.Element;
  title: string;
  value: number;
}

const DefaultRepositories = ({ repositoriesData, relevantMetrics }: { repositoriesData: RepositoriesData; relevantMetrics: Metric[] }) => {
  const firstRow = relevantMetrics.slice(0, 2);
  const secondRow = relevantMetrics.slice(2, 4);

  return (
    <>
      <div className="w100 flex justify-between">
        <StatisticRow
          rows={firstRow.map((metric) => ({
            icon: metric.icon,
            title: metric.title,
            value: abbreviateNumber(metric.value),
            strong: true,
          }))}
        />
        <StatisticRow
          className="align-flexend"
          rows={secondRow.map((metric) => ({
            icon: metric.icon,
            title: metric.title,
            value: abbreviateNumber(metric.value),
            strong: true,
          }))}
        />
      </div>
    </>
  );
};

const TerminalRepositories = ({ repositoriesData, relevantMetrics }: { repositoriesData: RepositoriesData; relevantMetrics: Metric[] }) => {
  const gridData = relevantMetrics.map((metric) => ({
    title: metric.title,
    value: abbreviateNumber(metric.value),
  }));

  return <TerminalGrid data={gridData} rightText="Metric" leftText="Value" />;
};

export default function GithubRepositories({ repositoriesData }: { repositoriesData: RepositoriesData }): JSX.Element {
  const { pluginGithub } = getEnvVariables();
  if (!pluginGithub) throw new Error("Github plugin not found in GithubProfile component");

  const title = pluginGithub.repositories_title.replace("<qnt>", repositoriesData.repositories.length.toString());
  const hideTitle = pluginGithub.repositories_hide_title;

  const allMetrics = [
    { icon: <RiStarLine />, title: "Stars", value: repositoriesData.totalStars },
    { icon: <RiGitForkLine />, title: "Forks", value: repositoriesData.totalForks },
    { icon: <RiEyeLine />, title: "Watchers", value: repositoriesData.totalWatchers },
    { icon: <RiFileCodeLine />, title: "Total Releases", value: repositoriesData.totalReleases },
    { icon: <RiGitMergeLine />, title: "Total Deployments", value: repositoriesData.totalDeployments },
    { icon: <RiGitMergeLine />, title: "Total Environments", value: repositoriesData.totalEnvironments },
    { icon: <RiGitClosePullRequestLine />, title: "Total Issues Open", value: repositoriesData.totalIssuesOpen },
    { icon: <RiGitClosePullRequestLine />, title: "Total Issues Closed", value: repositoriesData.totalIssuesClosed },
    { icon: <RiGitPullRequestLine />, title: "Total PRs Open", value: repositoriesData.totalPRsOpen },
    { icon: <RiGitClosePullRequestLine />, title: "Total PRs Closed", value: repositoriesData.totalPRsClosed },
    { icon: <RiGitBranchLine />, title: "Total PRs Merged", value: repositoriesData.totalPRsMerged },
  ];

  const relevantMetrics = allMetrics
    .filter((metric) => metric.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <section id="github" className="github-profile">
      <RenderBasedOnStyle
        defaultComponent={
          <>
            {!hideTitle && <DefaultTitle title={title} icon={<RiGitRepositoryLine />} />}
            <DefaultRepositories repositoriesData={repositoriesData} relevantMetrics={relevantMetrics} />
          </>
        }
        terminalComponent={
          <>
            <TerminalCommand
              command={getPseudoCommands({
                plugin: "github",
                section: "profile",
                username: pluginGithub.username,
              })}
            />
            <TerminalRepositories repositoriesData={repositoriesData} relevantMetrics={relevantMetrics} />
            <TerminalLineBreak />
          </>
        }
      />
    </section>
  );
}
