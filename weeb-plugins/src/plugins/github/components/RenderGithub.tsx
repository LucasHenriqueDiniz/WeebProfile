import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle"
import type { GithubConfig, GithubData } from "../types"
import { GithubActivity } from "./Activity"
import { GithubCalendar } from "./Calendar"
import { GithubCodeHabits } from "./CodeHabits"
import { FavoriteLanguages } from "./FavoriteLanguages"
import { FavoriteLicense } from "./FavoriteLicense"
import { GithubFeaturedRepositories } from "./FeaturedRepositories"
import { GithubGists } from "./Gists"
import { GithubIntroduction } from "./Introduction"
import { GithubNotableContributions } from "./NotableContributions"
import { GithubPeople } from "./People"
import { GithubProfile } from "./Profile"
import { GithubRecentActivity } from "./RecentActivity"
import { GithubRepositories } from "./Repositories"
import { GithubRepositoryContributors } from "./RepositoryContributors"
import { GithubSponsors } from "./Sponsors"
import { GithubSponsorships } from "./Sponsorships"
import { GithubStargazers } from "./Stargazers"
import { GithubStarLists } from "./StarLists"
import { GithubStarredRepositories } from "./StarredRepositories"
import { GithubTopRepositories } from "./TopRepositories"

interface RenderGithubProps {
  config: GithubConfig
  data: GithubData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderGithub({
  config,
  data,
  style = "default",
  size = "half",
}: RenderGithubProps): React.ReactElement {
  if (!config.enabled || !config.sections || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Renderizar cada seção solicitada
  const renderedSections = sections.map((section) => {
    switch (section) {
      case "profile":
        return <GithubProfile key="profile" data={data.user} config={config} style={style} size={size} />
      case "repositories":
        return (
          <GithubRepositories
            key="repositories"
            data={data.repositories}
            totalDiskUsage={data.totalDiskUsage}
            sponsoringCount={data.sponsoringCount}
            favoriteLicense={data.favoriteLicense}
            config={config}
            style={style}
            size={size}
          />
        )
      case "favorite_languages":
        return (
          <FavoriteLanguages
            key="favorite_languages"
            languageData={data.languages}
            config={config}
            style={style}
            size={size}
          />
        )
      case "favorite_license":
        return (
          <FavoriteLicense
            key="favorite_license"
            data={data.favoriteLicense}
            config={config}
            style={style}
            size={size}
          />
        )
      case "activity":
        return <GithubActivity key="activity" data={data.activity} config={config} style={style} size={size} />
      case "calendar":
        return <GithubCalendar key="calendar" data={data.calendar} config={config} style={style} size={size} />
      case "code_habits":
        return <GithubCodeHabits key="code_habits" data={data.codeHabits} config={config} style={style} size={size} />
      case "starred_repositories":
        return (
          <GithubStarredRepositories
            key="starred_repositories"
            data={data.starredRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "gists":
        return <GithubGists key="gists" data={data.gists} config={config} style={style} size={size} />
      case "stargazers":
        return <GithubStargazers key="stargazers" data={data.stargazers} config={config} style={style} size={size} />
      case "top_repositories":
        return (
          <GithubTopRepositories
            key="top_repositories"
            data={data.topRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "introduction":
        return (
          <GithubIntroduction
            key="introduction"
            data={data.introduction}
            config={config}
            style={style}
            size={size}
            activity={data.activity}
          />
        )
      case "recent_activity":
        return (
          <GithubRecentActivity
            key="recent_activity"
            data={data.recentActivity}
            config={config}
            style={style}
            size={size}
          />
        )
      case "sponsorships":
        return (
          <GithubSponsorships key="sponsorships" data={data.sponsorships} config={config} style={style} size={size} />
        )
      case "sponsors":
        return <GithubSponsors key="sponsors" data={data.sponsors} config={config} style={style} size={size} />
      case "star_lists":
        return <GithubStarLists key="star_lists" data={data.starLists} config={config} style={style} size={size} />
      case "notable_contributions":
        return (
          <GithubNotableContributions
            key="notable_contributions"
            data={data.notableContributions}
            config={config}
            style={style}
            size={size}
          />
        )
      case "featured_repositories":
        return (
          <GithubFeaturedRepositories
            key="featured_repositories"
            data={data.featuredRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "people":
        return <GithubPeople key="people" data={data.people} config={config} style={style} size={size} />
      case "repository_contributors":
        return (
          <GithubRepositoryContributors
            key="repository_contributors"
            data={data.repositoryContributors}
            config={config}
            style={style}
            size={size}
          />
        )
      default:
        return (
          <div key={section} className="text-muted">
            Section &quot;{section}&quot; not yet implemented
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}
